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
  minBudget: number;
  maxBudget: number;
  messageCard: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose" | string;
  fontStyle?: "serif" | "handwriting" | "sans" | "mono" | string;
  packagingStyle?: "STANDARD" | "BOJAGI" | "LUXURY_RIBBON" | "ECO_CRAFT" | string;
  sealMonogram?: string;
  claimPin?: string;
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
  isSoldOut?: boolean;
  stockQuantity?: number;
}

export interface CurationBoxResponse {
  id: number;
  senderName: string;
  messageCard: string;
  cardTheme?: "ivory" | "emerald" | "noir" | "rose" | string;
  fontStyle?: "serif" | "handwriting" | "sans" | "mono" | string;
  packagingStyle?: "STANDARD" | "BOJAGI" | "LUXURY_RIBBON" | "ECO_CRAFT" | string;
  sealMonogram?: string;
  hasPinSecurity?: boolean;
  minBudget: number;
  maxBudget: number;
  sharingToken: string;
  allowCustomInput: boolean;
  items: ProductDto[];
  rollingPaperMessages?: RollingPaperMessageDto[];
}

export interface RollingPaperMessageDto {
  id: number;
  authorName: string;
  message: string;
  avatarEmoji?: string;
  createdAt?: string;
}

export interface AddRollingPaperPayload {
  authorName: string;
  message: string;
  avatarEmoji?: string;
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
  desiredDeliveryDate?: string;
  ecoFriendlyPackaging?: boolean;
  entranceMemo?: string;
  preDeliveryNotification?: boolean;
}

export interface OrderResponse {
  orderId: number;
  selectedProductName: string;
  selectedProductBrand: string;
  selectedOption?: string;
  shippingStatus: string;
  carrierName?: string;
  trackingNumber?: string;
  lockedAmount: number;
  finalAmount: number;
  refundAmount: number;
  status: string;
  externalUrl?: string;
  desiredDeliveryDate?: string;
  ecoFriendlyPackaging?: boolean;
  entranceMemo?: string;
  preDeliveryNotification?: boolean;
  thankYouSticker?: string;
  thankYouMessage?: string;
  thankYouPhotoUrl?: string;
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

export async function cancelGiftBox(token: string): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/cancel/${token}`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("선물 상자 취소 처리에 실패했습니다.");
  }
  return res.json();
}

export async function resendGiftNotification(sharingToken: string): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/resend-notification/${sharingToken}`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("알림톡 재발송에 실패했습니다.");
  }
  return res.json();
}

export async function extendGiftExpiry(sharingToken: string): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/extend-expiry/${sharingToken}`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("선물 수락 기한 연장에 실패했습니다.");
  }
  return res.json();
}

export async function fetchProducts(keyword?: string, minBudget?: number, maxBudget?: number, category?: string, sort?: string): Promise<ProductDto[]> {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (minBudget) params.append("minBudget", minBudget.toString());
  if (maxBudget) params.append("maxBudget", maxBudget.toString());
  if (category && category !== "ALL") params.append("category", category);
  if (sort && sort !== "DEFAULT") params.append("sort", sort);

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function searchOpenProducts(query: string): Promise<ProductDto[]> {
  const res = await fetch(`${BASE_URL}/products/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export interface SupportInquiryRequest {
  name: string;
  email: string;
  category: string;
  content: string;
}

export interface SupportInquiryResponse {
  status: string;
  inquiryId: string;
  message: string;
  statusLabel?: string;
  category?: string;
  registeredAt?: string;
  estimatedReplyTime?: string;
  adminNote?: string;
}

export async function submitSupportInquiry(payload: SupportInquiryRequest): Promise<SupportInquiryResponse> {
  const res = await fetch(`${BASE_URL}/support/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("문의 접수에 실패했습니다.");
  }
  return res.json();
}

export async function getInquiryStatus(inquiryId: string): Promise<SupportInquiryResponse> {
  const res = await fetch(`${BASE_URL}/support/inquiries/${inquiryId}`);
  if (!res.ok) {
    throw new Error("문의 내역을 조회할 수 없습니다.");
  }
  return res.json();
}

export async function verifyClaimPin(sharingToken: string, pin: string): Promise<{ valid: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/curation-boxes/verify-pin/${sharingToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) {
    throw new Error("PIN 번호 검증에 실패했습니다.");
  }
  return res.json();
}

export interface ThankYouReplyPayload {
  thankYouSticker?: string;
  thankYouMessage: string;
  thankYouPhotoUrl?: string;
}

export async function submitThankYouReply(sharingToken: string, payload: ThankYouReplyPayload): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/thank-you/${sharingToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("감사 카드 등록에 실패했습니다.");
  }
  return res.json();
}

export interface GenerateAiMessageRequest {
  situation: string;
  tone?: string;
  receiverName?: string;
  senderName?: string;
  relationship?: string;
  customKeyword?: string;
}

export interface AiMessageResponse {
  situation: string;
  tone: string;
  generatedMessage: string;
  alternativeSnippets: string[];
  recommendedTheme: string;
  recommendedMonogram: string;
  stylingTip: string;
}

export async function generateAiMessage(payload: GenerateAiMessageRequest): Promise<AiMessageResponse> {
  const res = await fetch(`${BASE_URL}/curation-boxes/ai-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("AI 메시지 생성에 실패했습니다.");
  }
  return res.json();
}

export interface ModifyAddressPayload {
  receiverName?: string;
  receiverPhone?: string;
  shippingAddress: string;
  deliveryMemo?: string;
  desiredDeliveryDate?: string;
  ecoFriendlyPackaging?: boolean;
  entranceMemo?: string;
  preDeliveryNotification?: boolean;
}

export async function modifyRecipientAddress(sharingToken: string, payload: ModifyAddressPayload): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders/modify-address/${sharingToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("배송 주소지 변경에 실패했습니다.");
  }
  return res.json();
}

export async function addRollingPaperMessage(sharingToken: string, payload: AddRollingPaperPayload): Promise<CurationBoxResponse> {
  const res = await fetch(`${BASE_URL}/curation-boxes/${sharingToken}/rolling-paper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("롤링페이퍼 메시지 등록에 실패했습니다.");
  }
  return res.json();
}

