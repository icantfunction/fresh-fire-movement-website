import type {
  WorkshopRegistrationPayload,
  WorkshopRegistrationResponse,
} from "@/types/workshop";

const API_URL = `${import.meta.env.VITE_API_BASE || "https://y5w6n0i9vc.execute-api.us-east-1.amazonaws.com/prod"}/workshop`;

export async function submitWorkshopRegistration(
  payload: WorkshopRegistrationPayload
): Promise<WorkshopRegistrationResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data?.ok) {
    throw new Error("Registration failed");
  }

  return data;
}
