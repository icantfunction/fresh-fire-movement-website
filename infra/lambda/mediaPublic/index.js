const crypto = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);
const s3 = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME;
const MEDIA_BUCKET = process.env.MEDIA_BUCKET;
const UPLOAD_URL_TTL_SEC = Number(process.env.UPLOAD_URL_TTL_SEC || "900");
const ARCHIVE_URL_TTL_SEC = Number(process.env.ARCHIVE_URL_TTL_SEC || "3600");

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

const isAllowedContentType = (contentType) =>
  typeof contentType === "string" &&
  (contentType.startsWith("image/") || contentType.startsWith("video/"));

const normalizeCapturedAt = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const sanitizeFileName = (fileName) => {
  const base = String(fileName || "upload")
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120);
  return base || "upload";
};

const mapMediaType = (contentType) => (contentType && contentType.startsWith("video/") ? "video" : "image");

exports.handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.rawPath || event.path || "";

    if (method === "OPTIONS") {
      return jsonResponse(204, { ok: true });
    }

    if (method === "POST" && path.endsWith("/media/upload-url")) {
      if (!MEDIA_BUCKET || !TABLE_NAME) {
        return jsonResponse(500, { ok: false, message: "Server not configured" });
      }

      const payload = event.body ? JSON.parse(event.body) : null;
      if (!payload) {
        return jsonResponse(400, { ok: false, message: "Missing request body" });
      }

      const fileName = sanitizeFileName(payload.fileName);
      const contentType = String(payload.contentType || "").trim();
      const capturedAt = normalizeCapturedAt(payload.capturedAt);

      if (!fileName || !isAllowedContentType(contentType) || !capturedAt) {
        return jsonResponse(400, { ok: false, message: "Invalid upload request" });
      }

      const submissionId = crypto.randomUUID();
      const objectKey = `pending/${submissionId}-${fileName}`;

      const presignedPost = await createPresignedPost(s3, {
        Bucket: MEDIA_BUCKET,
        Key: objectKey,
        Expires: UPLOAD_URL_TTL_SEC,
        Fields: {
          "Content-Type": contentType,
          "x-amz-meta-capturedat": capturedAt,
          "x-amz-meta-originalfilename": fileName,
        },
        Conditions: [
          { "Content-Type": contentType },
          { "x-amz-meta-capturedat": capturedAt },
          { "x-amz-meta-originalfilename": fileName },
        ],
      });

      return jsonResponse(200, {
        ok: true,
        submissionId,
        objectKey,
        uploadUrl: presignedPost.url,
        uploadFields: presignedPost.fields,
      });
    }

    if (method === "POST" && path.endsWith("/media/submissions")) {
      const payload = event.body ? JSON.parse(event.body) : null;
      if (!payload) {
        return jsonResponse(400, { ok: false, message: "Missing request body" });
      }

      const requiredFields = [
        "submissionId",
        "objectKey",
        "fileName",
        "contentType",
        "title",
        "capturedAt",
        "submittedBy",
      ];
      const missing = requiredFields.filter(
        (field) => payload[field] === undefined || payload[field] === null || payload[field] === ""
      );
      if (missing.length) {
        return jsonResponse(400, { ok: false, message: "Missing required fields", missing });
      }

      const submissionId = String(payload.submissionId).trim();
      const objectKey = String(payload.objectKey).trim();
      const fileName = sanitizeFileName(payload.fileName);
      const contentType = String(payload.contentType || "").trim();
      const title = String(payload.title || "").trim();
      const description = payload.description ? String(payload.description).trim() : "";
      const submittedBy = String(payload.submittedBy || "").trim();
      const capturedAtInput = normalizeCapturedAt(payload.capturedAt);

      if (
        !submissionId ||
        !objectKey ||
        !objectKey.startsWith(`pending/${submissionId}-`) ||
        !fileName ||
        !title ||
        !submittedBy ||
        !isAllowedContentType(contentType) ||
        !capturedAtInput
      ) {
        return jsonResponse(400, { ok: false, message: "Invalid submission payload" });
      }

      const head = await s3.send(
        new HeadObjectCommand({
          Bucket: MEDIA_BUCKET,
          Key: objectKey,
        })
      );

      const capturedAtFromMetadata =
        normalizeCapturedAt(head.Metadata?.capturedat || head.Metadata?.captured_at) || null;
      const capturedAt = capturedAtFromMetadata || capturedAtInput || new Date().toISOString();

      const createdAt = new Date().toISOString();
      const item = {
        submissionId,
        status: "pending",
        storageBucket: MEDIA_BUCKET,
        storageKey: objectKey,
        fileName,
        contentType,
        mediaType: mapMediaType(contentType),
        title,
        description,
        submittedBy,
        capturedAt,
        capturedAtSource: capturedAtFromMetadata ? "s3-metadata" : "user-input",
        fileSize: Number(head.ContentLength || 0),
        createdAt,
      };

      await dynamo.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
          ConditionExpression: "attribute_not_exists(submissionId)",
        })
      );

      return jsonResponse(200, { ok: true, submissionId });
    }

    if (method === "GET" && path.endsWith("/media/archive")) {
      const result = await dynamo.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "#status = :approved",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":approved": "approved",
          },
        })
      );

      const items = result.Items || [];
      const withUrls = await Promise.all(
        items.map(async (item) => {
          const key = item.approvedKey || item.storageKey;
          if (!key) return null;
          try {
            const previewUrl = await getSignedUrl(
              s3,
              new GetObjectCommand({
                Bucket: MEDIA_BUCKET,
                Key: key,
              }),
              { expiresIn: ARCHIVE_URL_TTL_SEC }
            );
            return {
              submissionId: item.submissionId,
              title: item.title,
              description: item.description || "",
              mediaType: item.mediaType || "image",
              previewUrl,
              capturedAt: item.capturedAt || item.createdAt,
              approvedAt: item.approvedAt || item.reviewedAt || item.createdAt,
            };
          } catch {
            return null;
          }
        })
      );

      const archiveItems = withUrls
        .filter((item) => item !== null)
        .sort((a, b) => (b.approvedAt || "").localeCompare(a.approvedAt || ""));

      return jsonResponse(200, { ok: true, items: archiveItems });
    }

    return jsonResponse(404, { ok: false, message: "Not found" });
  } catch (error) {
    console.error("mediaPublic error", error);
    return jsonResponse(500, { ok: false, message: "Server error" });
  }
};
