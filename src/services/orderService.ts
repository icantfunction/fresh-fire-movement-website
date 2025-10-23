import { SpaghettiOrder, OrderResponse } from "@/types/order";

const API_BASE = import.meta.env.VITE_API_BASE || "https://y5w6n0i9vc.execute-api.us-east-1.amazonaws.com/prod";
const API_URL = `${API_BASE}/orders`;

export async function submitSpaghettiOrder(
  orderData: SpaghettiOrder
): Promise<OrderResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.ok) {
    throw new Error("Order submission failed");
  }

  return data;
}
