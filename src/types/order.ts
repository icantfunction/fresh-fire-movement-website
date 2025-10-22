export interface SpaghettiOrder {
  name: string;
  phone: string;
  email?: string;
  quantity: number;
  notes?: string;
}

export interface OrderResponse {
  ok: boolean;
  orderId: string;
}
