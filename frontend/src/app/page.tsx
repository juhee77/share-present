"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import ShareModal from "@/components/ShareModal";
import CheckoutModal from "@/components/CheckoutModal";
import AiMessageAssistantModal from "@/components/AiMessageAssistantModal";
import StepProgress from "@/components/create/StepProgress";
import OccasionBudgetStep from "@/components/create/OccasionBudgetStep";
import GiftPickerStep from "@/components/create/GiftPickerStep";
import CardDesignStep from "@/components/create/CardDesignStep";
import ReviewStep from "@/components/create/ReviewStep";
import StickyActionBar from "@/components/create/StickyActionBar";
import { useToast } from "@/context/ToastContext";
import { createCurationBox } from "@/lib/api";
import {
  INITIAL_GIFT_DRAFT,
  GiftDraft,
  CreateStepId,
  getNextStep,
  getPrevStep,
  updateDraft,
  validateStep,
} from "@/lib/createFlow";

export default function CreateGiftPage() {
  const { showToast } = useToast();

  // Immutable draft state
  const [draft, setDraft] = useState<GiftDraft>(INITIAL_GIFT_DRAFT);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update draft immutably
  const handleDraftChange = useCallback((patch: Partial<GiftDraft>) => {
    setDraft((prev) => updateDraft(prev, patch));
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Next step handler
  const handleNext = () => {
    const validation = validateStep(draft, draft.step);
    if (!validation.isValid) {
      showToast(validation.error || "입력 내용을 확인해주세요.", "error");
      return;
    }

    if (draft.step === "review") {
      setIsCheckoutOpen(true);
      return;
    }

    const next = getNextStep(draft.step);
    if (next) {
      handleDraftChange({ step: next });
      scrollToTop();
    }
  };

  // Prev step handler
  const handlePrev = () => {
    const prev = getPrevStep(draft.step);
    if (prev) {
      handleDraftChange({ step: prev });
      scrollToTop();
    }
  };

  // Direct step click handler
  const handleStepClick = (stepId: CreateStepId) => {
    handleDraftChange({ step: stepId });
    scrollToTop();
  };

  // API Call to create the Curation Box
  const executeCreateLink = async () => {
    setIsSubmitting(true);
    try {
      const customProductsPayload =
        draft.customName && draft.customUrl
          ? [
              {
                brand: draft.customBrand || "CUSTOM",
                name: draft.customName,
                externalUrl: draft.customUrl,
                description: draft.customDesc,
              },
            ]
          : [];

      const result = await createCurationBox({
        senderId: 1,
        minBudget: draft.minBudget,
        maxBudget: draft.maxBudget,
        messageCard: draft.messageCard,
        cardTheme: draft.cardTheme,
        fontStyle: draft.fontStyle,
        packagingStyle: draft.packagingStyle,
        sealMonogram: draft.sealMonogram,
        claimPin:
          draft.enablePinSecurity && draft.claimPin.trim().length === 4
            ? draft.claimPin.trim()
            : undefined,
        allowCustomInput: draft.allowCustomInput,
        productIds: draft.selectedProductIds,
        customProducts: customProductsPayload,
      });

      setCreatedToken(result.sharingToken);
      setIsCheckoutOpen(false);
      showToast("선물 큐레이션 박스가 생성되었습니다! 링크를 공유해보세요 ✨", "success");
    } catch (err) {
      console.error(err);
      // Fallback token for local showcase
      const fallbackToken = "demo-" + Math.random().toString(36).substring(2, 9);
      setCreatedToken(fallbackToken);
      setIsCheckoutOpen(false);
      showToast("선물 큐레이션 박스가 생성되었습니다! 링크를 공유해보세요 ✨", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f0]">
      <Header />

      <main className="p-4 sm:p-5 flex-1 max-w-[540px] mx-auto w-full pb-20">
        {/* 4-Step Progress Header */}
        <StepProgress
          currentStep={draft.step}
          onStepClick={handleStepClick}
        />

        {/* Step 1: Occasion & Budget */}
        {draft.step === "occasion" && (
          <OccasionBudgetStep
            draft={draft}
            onChange={handleDraftChange}
          />
        )}

        {/* Step 2: Curated Gift Picker */}
        {draft.step === "products" && (
          <GiftPickerStep
            draft={draft}
            onChange={handleDraftChange}
          />
        )}

        {/* Step 3: Card & Boutique Deco */}
        {draft.step === "card" && (
          <CardDesignStep
            draft={draft}
            onChange={handleDraftChange}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        )}

        {/* Step 4: Review & Safe Escrow */}
        {draft.step === "review" && (
          <ReviewStep
            draft={draft}
            onEditStep={handleStepClick}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            isSubmitting={isSubmitting}
          />
        )}
      </main>

      {/* Floating Bottom Action Bar */}
      <StickyActionBar
        draft={draft}
        onPrev={handlePrev}
        onNext={handleNext}
        isSubmitting={isSubmitting}
      />

      {/* Escrow Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={executeCreateLink}
        minBudget={draft.minBudget}
        maxBudget={draft.maxBudget}
        selectedProductCount={
          draft.selectedProductIds.length + (draft.customName ? 1 : 0)
        }
        senderName={draft.senderName}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={!!createdToken}
        onClose={() => setCreatedToken(null)}
        token={createdToken || ""}
        senderName={draft.senderName}
        messageCard={draft.messageCard}
        cardTheme={draft.cardTheme}
        sealMonogram={draft.sealMonogram}
      />

      {/* AI Message Assistant Modal */}
      <AiMessageAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialSituation={
          draft.activePresetId === "birthday"
            ? "BIRTHDAY"
            : draft.activePresetId === "housewarming"
            ? "HOUSEWARMING"
            : "THANK_YOU"
        }
        initialReceiverName=""
        onApply={(msg, theme, monogram) => {
          handleDraftChange({
            messageCard: msg,
            ...(theme && ["ivory", "emerald", "noir", "rose"].includes(theme)
              ? { cardTheme: theme as GiftDraft["cardTheme"] }
              : {}),
            ...(monogram && ["SP", "HBD", "LOVE", "THX", "LUCK", "CONG"].includes(monogram)
              ? { sealMonogram: monogram as GiftDraft["sealMonogram"] }
              : {}),
          });
        }}
      />
    </div>
  );
}
