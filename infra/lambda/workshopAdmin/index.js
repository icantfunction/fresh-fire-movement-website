const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

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

    if (method === "GET") {
      const result = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
      const items = result.Items || [];
      items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      return jsonResponse(200, { ok: true, items });
    }

    if (method === "POST" && path.endsWith("/workshop/attendance")) {
      const payload = event.body ? JSON.parse(event.body) : null;
      if (!payload || !payload.registrationId) {
        return jsonResponse(400, { ok: false, message: "Missing registrationId" });
      }

      const present = !!payload.present;
      const updatedAt = new Date().toISOString();

      await dynamo.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { registrationId: payload.registrationId },
          UpdateExpression: "SET present = :present, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":present": present,
            ":updatedAt": updatedAt,
          },
          ConditionExpression: "attribute_exists(registrationId)",
        })
      );

      return jsonResponse(200, { ok: true, registrationId: payload.registrationId, present });
    }

    return jsonResponse(404, { ok: false, message: "Not found" });
  } catch (error) {
    console.error("workshopAdmin error", error);
    return jsonResponse(500, { ok: false, message: "Server error" });
  }
};
