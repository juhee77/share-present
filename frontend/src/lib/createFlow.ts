export type CreateStepId = "occasion" | "products" | "card" | "review";

export interface GiftDraft {
  step: CreateStepId;
  senderName: string;
  minBudget: number;
  maxBudget: number;
  activePresetId: string;
  selectedProductIds: number[];
  allowCustomInput: boolean;
  customBrand: string;
  customName: string;
  customUrl: string;
  customDesc: string;
  messageCard: string;
  cardTheme: "ivory" | "emerald" | "noir" | "rose";
  fontStyle: "serif" | "handwriting" | "sans" | "mono";
  packagingStyle: "STANDARD" | "BOJAGI" | "LUXURY_RIBBON" | "ECO_CRAFT";
  sealMonogram: "SP" | "HBD" | "LOVE" | "THX" | "LUCK" | "CONG";
  enablePinSecurity: boolean;
  claimPin: string;
}

export interface StepMeta {
  id: CreateStepId;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const CREATE_STEPS: StepMeta[] = [
  {
    id: "occasion",
    number: 1,
    title: "상황·예산",
    subtitle: "선물하는 상황과 예산 범위를 정해주세요",
    icon: "🎂",
  },
  {
    id: "products",
    number: 2,
    title: "선물 선택",
    subtitle: "받는 분의 취향에 맞게 선물 목록을 큐레이션해요",
    icon: "🎁",
  },
  {
    id: "card",
    number: 3,
    title: "카드 데코",
    subtitle: "마음을 전할 편지와 부티크 패키징을 꾸며요",
    icon: "💌",
  },
  {
    id: "review",
    number: 4,
    title: "안심 결제",
    subtitle: "차액 100% 자동 환불 에스크로를 확인하고 발급해요",
    icon: "🛡️",
  },
];

export const INITIAL_GIFT_DRAFT: GiftDraft = {
  step: "occasion",
  senderName: "주희",
  minBudget: 30000,
  maxBudget: 60000,
  activePresetId: "birthday",
  selectedProductIds: [1, 2, 7],
  allowCustomInput: true,
  customBrand: "",
  customName: "",
  customUrl: "",
  customDesc: "",
  messageCard: "생일 진심으로 축하해! 마음에 드는 선물 하나 골라주면 주소지로 바로 보내줄게 🎁",
  cardTheme: "ivory",
  fontStyle: "serif",
  packagingStyle: "STANDARD",
  sealMonogram: "SP",
  enablePinSecurity: false,
  claimPin: "",
};

export function validateStep(
  draft: GiftDraft,
  stepId: CreateStepId = draft.step
): { isValid: boolean; error?: string } {
  if (stepId === "occasion") {
    if (!draft.senderName.trim()) {
      return { isValid: false, error: "보내시는 분의 성함을 입력해주세요." };
    }
    if (draft.minBudget > draft.maxBudget) {
      return { isValid: false, error: "최소 예산이 최대 예산보다 클 수 없습니다." };
    }
    return { isValid: true };
  }

  if (stepId === "products") {
    if (draft.selectedProductIds.length === 0) {
      return { isValid: false, error: "최소 1개 이상의 선물을 선택해주세요." };
    }
    return { isValid: true };
  }

  if (stepId === "card") {
    if (!draft.messageCard.trim()) {
      return { isValid: false, error: "메시지 카드 내용을 작성해주세요." };
    }
    if (draft.enablePinSecurity && draft.claimPin.trim().length !== 4) {
      return { isValid: false, error: "보안 PIN 번호 4자리를 정확히 입력해주세요." };
    }
    return { isValid: true };
  }

  if (stepId === "review") {
    const s1 = validateStep(draft, "occasion");
    if (!s1.isValid) return s1;
    const s2 = validateStep(draft, "products");
    if (!s2.isValid) return s2;
    const s3 = validateStep(draft, "card");
    if (!s3.isValid) return s3;
    return { isValid: true };
  }

  return { isValid: true };
}

export function canProceed(draft: GiftDraft): boolean {
  return validateStep(draft, draft.step).isValid;
}

export function getNextStep(current: CreateStepId): CreateStepId | null {
  const order: CreateStepId[] = ["occasion", "products", "card", "review"];
  const idx = order.indexOf(current);
  if (idx >= 0 && idx < order.length - 1) {
    return order[idx + 1];
  }
  return null;
}

export function getPrevStep(current: CreateStepId): CreateStepId | null {
  const order: CreateStepId[] = ["occasion", "products", "card", "review"];
  const idx = order.indexOf(current);
  if (idx > 0) {
    return order[idx - 1];
  }
  return null;
}

export function updateDraft(draft: GiftDraft, patch: Partial<GiftDraft>): GiftDraft {
  return { ...draft, ...patch };
}
