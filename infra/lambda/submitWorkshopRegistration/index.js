const crypto = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

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
    const payload = event.body ? JSON.parse(event.body) : null;
    if (!payload) {
      return jsonResponse(400, { ok: false, message: "Missing request body" });
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "yearsAtClc",
      "encounterCollide",
      "dateOfBirth",
      "grade",
      "audition",
    ];

    const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");
    if (missing.length) {
      return jsonResponse(400, { ok: false, message: "Missing required fields", missing });
    }

    if (typeof payload.encounterCollide !== "boolean" || typeof payload.audition !== "boolean") {
      return jsonResponse(400, { ok: false, message: "Invalid boolean fields" });
    }

    const yearsAtClc = Number(payload.yearsAtClc);
    if (!Number.isFinite(yearsAtClc) || yearsAtClc < 0) {
      return jsonResponse(400, { ok: false, message: "Invalid yearsAtClc" });
    }

    const registrationId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const item = {
      registrationId,
      firstName: String(payload.firstName).trim(),
      lastName: String(payload.lastName).trim(),
      phoneNumber: String(payload.phoneNumber).trim(),
      yearsAtClc,
      encounterCollide: payload.encounterCollide,
      dateOfBirth: String(payload.dateOfBirth).trim(),
      grade: String(payload.grade).trim(),
      audition: payload.audition,
      present: false,
      createdAt,
    };

    await dynamo.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(registrationId)",
      })
    );

    return jsonResponse(200, { ok: true, registrationId });
  } catch (error) {
    console.error("submitWorkshopRegistration error", error);
    return jsonResponse(500, { ok: false, message: "Server error" });
  }
};
