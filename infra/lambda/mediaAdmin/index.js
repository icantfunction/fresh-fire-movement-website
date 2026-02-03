const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);
const s3 = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME;
const MEDIA_BUCKET = process.env.MEDIA_BUCKET;
const PENDING_PREVIEW_URL_TTL_SEC = Number(process.env.PENDING_PREVIEW_URL_TTL_SEC || "900");

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  },
  body: JSON.stringify(body),
});

const normalizeCapturedAt = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const resolveReviewer = (event, payload) => {
  const claims = event.requestContext?.authorizer?.jwt?.claims || {};
  return claims.email || claims["cognito:username"] || payload?.reviewer || "admin";
};

const stripPrefix = (key) => {
  const idx = key.lastIndexOf("/");
  return idx >= 0 ? key.slice(idx + 1) : key;
};

exports.handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.rawPath || event.path || "";

    if (method === "OPTIONS") {
      return jsonResponse(204, { ok: true });
    }

    if (method === "GET" && path.endsWith("/media/pending")) {
      const result = await dynamo.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "#status = :pending",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":pending": "pending",
          },
        })
      );

      const items = result.Items || [];
      const withPreview = await Promise.all(
        items.map(async (item) => {
          if (!item.storageKey) return null;
          try {
            const previewUrl = await getSignedUrl(
              s3,
              new GetObjectCommand({
                Bucket: MEDIA_BUCKET,
                Key: item.storageKey,
              }),
              { expiresIn: PENDING_PREVIEW_URL_TTL_SEC }
            );

            return {
              submissionId: item.submissionId,
              title: item.title,
              description: item.description || "",
              mediaType: item.mediaType || "image",
              submittedBy: item.submittedBy || "",
              capturedAt: item.capturedAt || item.createdAt,
              createdAt: item.createdAt,
              previewUrl,
              status: item.status,
              fileName: item.fileName || "",
            };
          } catch {
            return null;
          }
        })
      );

      const pendingItems = withPreview
        .filter((item) => item !== null)
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

      return jsonResponse(200, { ok: true, items: pendingItems });
    }

    if (method === "POST" && path.endsWith("/media/review")) {
      const payload = event.body ? JSON.parse(event.body) : null;
      if (!payload || !payload.submissionId || !payload.action) {
        return jsonResponse(400, { ok: false, message: "Missing submissionId or action" });
      }

      const submissionId = String(payload.submissionId).trim();
      const action = String(payload.action).trim().toLowerCase();
      if (!submissionId || (action !== "approve" && action !== "reject")) {
        return jsonResponse(400, { ok: false, message: "Invalid review action" });
      }

      const found = await dynamo.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { submissionId },
        })
      );
      const item = found.Item;
      if (!item) {
        return jsonResponse(404, { ok: false, message: "Submission not found" });
      }
      if (item.status !== "pending") {
        return jsonResponse(409, { ok: false, message: "Submission already reviewed" });
      }

      const reviewer = resolveReviewer(event, payload);
      const reviewedAt = new Date().toISOString();

      if (action === "approve") {
        const sourceKey = item.storageKey;
        if (!sourceKey) {
          return jsonResponse(400, { ok: false, message: "Missing source media key" });
        }

        const sourceHead = await s3.send(
          new HeadObjectCommand({
            Bucket: MEDIA_BUCKET,
            Key: sourceKey,
          })
        );

        const approvedKey = `approved/${submissionId}-${stripPrefix(sourceKey)}`;
        await s3.send(
          new CopyObjectCommand({
            Bucket: MEDIA_BUCKET,
            CopySource: `${MEDIA_BUCKET}/${sourceKey}`,
            Key: approvedKey,
            MetadataDirective: "COPY",
          })
        );

        await s3.send(
          new DeleteObjectCommand({
            Bucket: MEDIA_BUCKET,
            Key: sourceKey,
          })
        );

        const capturedAtFromMetadata =
          normalizeCapturedAt(sourceHead.Metadata?.capturedat || sourceHead.Metadata?.captured_at) || null;
        const capturedAt =
          capturedAtFromMetadata ||
          normalizeCapturedAt(item.capturedAt) ||
          normalizeCapturedAt(sourceHead.LastModified) ||
          reviewedAt;

        await dynamo.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { submissionId },
            UpdateExpression:
              "SET #status = :status, approvedKey = :approvedKey, approvedAt = :approvedAt, reviewedAt = :reviewedAt, reviewedBy = :reviewedBy, capturedAt = :capturedAt, capturedAtSource = :capturedAtSource",
            ExpressionAttributeNames: {
              "#status": "status",
            },
            ExpressionAttributeValues: {
              ":status": "approved",
              ":approvedKey": approvedKey,
              ":approvedAt": reviewedAt,
              ":reviewedAt": reviewedAt,
              ":reviewedBy": reviewer,
              ":capturedAt": capturedAt,
              ":capturedAtSource": capturedAtFromMetadata ? "s3-metadata" : item.capturedAtSource || "user-input",
              ":pending": "pending",
            },
            ConditionExpression: "#status = :pending",
          })
        );

        return jsonResponse(200, { ok: true, submissionId, status: "approved" });
      }

      if (item.storageKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: MEDIA_BUCKET,
            Key: item.storageKey,
          })
        );
      }

      await dynamo.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { submissionId },
          UpdateExpression: "SET #status = :status, reviewedAt = :reviewedAt, reviewedBy = :reviewedBy",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": "rejected",
            ":reviewedAt": reviewedAt,
            ":reviewedBy": reviewer,
            ":pending": "pending",
          },
          ConditionExpression: "#status = :pending",
        })
      );

      return jsonResponse(200, { ok: true, submissionId, status: "rejected" });
    }

    return jsonResponse(404, { ok: false, message: "Not found" });
  } catch (error) {
    console.error("mediaAdmin error", error);
    return jsonResponse(500, { ok: false, message: "Server error" });
  }
};
