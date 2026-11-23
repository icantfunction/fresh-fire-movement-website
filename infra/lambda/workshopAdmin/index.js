const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const DEFAULT_TABLE_NAME = process.env.TABLE_NAME;
const WORKSHOP_TABLE_NAME = process.env.WORKSHOP_TABLE_NAME || DEFAULT_TABLE_NAME;
const AUDITION_TABLE_NAME = process.env.AUDITION_TABLE_NAME || DEFAULT_TABLE_NAME;

const resolveTableName = (path) => {
  if (path.endsWith("/audition") || path.endsWith("/audition/attendance")) {
    return AUDITION_TABLE_NAME;
  }
  return WORKSHOP_TABLE_NAME;
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.rawPath || event.path || "";
    const tableName = resolveTableName(path);
    if (!tableName) {
      return jsonResponse(500, { ok: false, message: "Missing table configuration" });
    }

    if (method === "GET") {
      const items = [];
      let lastKey;
      do {
        const page = await dynamo.send(
          new ScanCommand({ TableName: tableName, ExclusiveStartKey: lastKey })
        );
        items.push(...(page.Items || []));
        lastKey = page.LastEvaluatedKey;
      } while (lastKey);
      items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      return jsonResponse(200, { ok: true, items });
    }

    const isWorkshopAttendancePath = path.endsWith("/workshop/attendance");
    const isAuditionAttendancePath = path.endsWith("/audition/attendance");

    if (method === "POST" && (isWorkshopAttendancePath || isAuditionAttendancePath)) {
      const payload = event.body ? JSON.parse(event.body) : null;
      if (!payload || !payload.registrationId) {
        return jsonResponse(400, { ok: false, message: "Missing registrationId" });
      }

      const present = !!payload.present;
      const updatedAt = new Date().toISOString();

      await dynamo.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { registrationId: payload.registrationId },
          UpdateExpression: "SET present = :present, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":present": present,
            ":updatedAt": updatedAt,
            ":archived": "ARCHIVED",
          },
          ConditionExpression:
            "attribute_exists(registrationId) AND (attribute_not_exists(registrationStatus) OR registrationStatus <> :archived)",
        })
      );

      return jsonResponse(200, { ok: true, registrationId: payload.registrationId, present });
    }

    return jsonResponse(404, { ok: false, message: "Not found" });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return jsonResponse(409, { ok: false, message: "Only current registrations can be checked in." });
    }
    console.error("workshopAdmin error", error);
    return jsonResponse(500, { ok: false, message: "Server error" });
  }
};
