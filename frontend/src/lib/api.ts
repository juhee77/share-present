const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

export interface CustomProductPayload {
  brand: string;
  name: string;
  description?: string;
  externalUrl: string;
  options?: string[];
  icon?: string;
}

export interface CreateCurationBoxRequest {
  senderId: number;
  maxBudget: number;
  messageCard: string;
  allowCustomInput: boolean;
  productIds: number[];
  customProducts?: CustomProductPayload[];
}

export interface ProductDto {
  id: number | string;
  brand: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  externalUrl?: string;
  options?: string[];
  isCustom?: boolean;
  icon?: string;
}

export interface CurationBoxResponse {
  id: number;
  senderName: string;
  messageCard: string;
  maxBudget: number;
  sharingToken: string;
  allowCustomInput: boolean;
  items: ProductDto[];
}

export interface AcceptGiftRequest {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  selectedProductId?: number;
  selectedOption?: string;
  isRecipientAdded?: boolean;
  recipientCustomBrand?: string;
  recipientCustomName?: string;
  recipientCustomUrl?: string;
}

export interface OrderResponse {
  orderId: number;
  selectedProductName: string;
  selectedProductBrand: string;
  selectedOption?: string;
  shippingStatus: string;
  lockedAmount: number;
  finalAmount: number;
  refundAmount: number;
  status: string;
  externalUrl?: string;
}

export async function createCurationBox(payload: CreateCurationBoxRequest): Promise<CurationBoxResponse> {
  const res = await fetch(`${BASE_URL}/curation-boxes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("선물 상자 생성에 실패했습니다.");
  }
  return res.json();
}

export async function getCurationBox(token: string): Promise<CurationBoxResponse> {
  const res = await fetch(`${BASE_URL}/curation-boxes/${token}`);
  if (!res.ok) {
    throw new Error("선물 상자를 찾을 수 없습니다.");
  }
  return res.json();
}

export async function acceptGift(token: string, payload: AcceptGiftRequest): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/accept/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("선물 수락 처리에 실패했습니다.");
  }
  return res.json();
}

export async function getOrderResult(token: string): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/result/${token}`);
  if (!res.ok) {
    throw new Error("정산 결과를 찾을 수 없습니다.");
  }
  return res.json();
}

export async function prePayOrder(curationBoxId: number, paymentKey: string): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/pre-pay?curationBoxId=${curationBoxId}&paymentKey=${paymentKey}`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("가결제 처리에 실패했습니다.");
  }
  return res.json();
}
