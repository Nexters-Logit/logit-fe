"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { useUserMe } from "@/app/_hooks/useUserMe";
import { TermsCheckbox } from "./TermsCheckbox";

export type MobilePlanInfo = {
  id: string;
  subscriptionType: "logit" | "mcp";
  name: string;
  price: number;
};

const MOBILE_TERMS = [
  { id: "payapp_service", label: "페이앱 서비스 이용 약관", required: true },
  { id: "subscription", label: "유료서비스 및 정기결제 이용 약관", required: true },
  { id: "refund", label: "해지 및 환불 정책 동의", required: false },
  { id: "credit", label: "개인(신용)정보 제공 동의", required: false },
  { id: "id_info", label: "고유식별정보 처리 동의", required: false },
] as const;

type TermId = (typeof MOBILE_TERMS)[number]["id"];

function formatPhoneDigits(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
}

export function MobilePaymentSheet({
  plan,
  onClose,
}: {
  plan: MobilePlanInfo | null;
  onClose: () => void;
}) {
  const { data: user } = useUserMe();
  const [phone, setPhone] = useState("");
  const [checkedTerms, setCheckedTerms] = useState<Set<TermId>>(new Set());
  const [isPending, setIsPending] = useState(false);
  const hasPrefilledPhone = useRef(false);

  useEffect(() => {
    if (!plan) {
      setPhone("");
      setCheckedTerms(new Set());
      setIsPending(false);
      hasPrefilledPhone.current = false;
    }
  }, [plan]);

  useEffect(() => {
    if (user?.phone && !hasPrefilledPhone.current) {
      hasPrefilledPhone.current = true;
      const digits = user.phone.replace(/\D/g, "");
      setPhone(formatPhoneDigits(digits));
    }
  }, [user?.phone]);

  const requiredIds = MOBILE_TERMS.filter((t) => t.required).map((t) => t.id);
  const allChecked = MOBILE_TERMS.every((t) => checkedTerms.has(t.id));
  const allRequiredChecked = requiredIds.every((id) => checkedTerms.has(id));
  const normalizedPhone = phone.replace(/\D/g, "");
  const isPhoneValid = normalizedPhone.length === 10 || normalizedPhone.length === 11;
  const canPay = allRequiredChecked && isPhoneValid && !isPending;

  const toggleTerm = (id: TermId) => {
    setCheckedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setCheckedTerms(
      allChecked ? new Set() : new Set(MOBILE_TERMS.map((t) => t.id)),
    );
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    setPhone(formatPhoneDigits(digits));
  };

  const dragStartY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - dragStartY.current;
    if (diff > 0) setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  };

  const handlePay = async () => {
    if (!plan || !canPay) return;
    setIsPending(true);
    try {
      const { payurl } = await apiFetch<{ payurl: string; rebill_no: string }>(
        API_ENDPOINTS.paymentInitiate,
        {
          method: "POST",
          body: JSON.stringify({
            subscription_type: plan.subscriptionType,
            plan: plan.id,
            phone: normalizedPhone,
          }),
        },
      );
      window.location.assign(payurl);
    } catch {
      showToast.error("결제를 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setIsPending(false);
    }
  };

  return (
    <DialogPrimitive.Root open={!!plan} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />
        <DialogPrimitive.Content
          style={{ transform: `translateY(${dragOffset}px)` }}
          className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white shadow-sheet outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300"
        >
          <button
            type="button"
            aria-label="닫기"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={onClose}
            className="flex w-full cursor-grab items-center justify-center pb-2 pt-3 active:cursor-grabbing"
          >
            <span className="h-1 w-10 rounded-full bg-gray-70" />
          </button>

          <div className="px-6 pb-2 pt-3">
            <DialogPrimitive.Title className="text-title-3 text-gray-500">
              결제하기
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1 text-body-7-3 text-gray-200">
              결제 정보를 등록 하려면 약관 동의가 필요해요.
            </DialogPrimitive.Description>
          </div>

          <div className="overflow-y-auto px-6 pb-6 scrollbar-hide">
            <div className="mb-5 mt-4">
              <label
                htmlFor="mobile-payment-phone"
                className="mb-2 block text-body-7-2 text-gray-400"
              >
                결제 알림을 받을 휴대폰 번호
              </label>
              <Input
                id="mobile-payment-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="010-1234-5678"
                className="h-12 rounded-xl bg-white text-body-5-4"
                aria-invalid={phone.length > 0 && !isPhoneValid}
              />
              {user?.phone && (
                <p className="mt-1.5 text-body-9-3 text-gray-200">
                  저장된 번호가 자동 입력되었어요. 변경하시면 새 번호로 저장됩니다.
                </p>
              )}
            </div>

            <div className="border-b border-gray-70 pb-4">
              <TermsCheckbox
                checked={allChecked}
                onChange={toggleAll}
                label="약관 모두 동의하기"
              />
            </div>

            <div className="flex flex-col gap-3.5 pt-4">
              {MOBILE_TERMS.map((term) => (
                <div key={term.id} className="flex items-center justify-between">
                  <TermsCheckbox
                    checked={checkedTerms.has(term.id)}
                    onChange={() => toggleTerm(term.id)}
                    label={
                      <>
                        {term.required && (
                          <span className="mr-1 text-primary-200">[필수]</span>
                        )}
                        {term.label}
                      </>
                    }
                  />
                  <button
                    type="button"
                    className="shrink-0 p-1 text-gray-100 transition-colors hover:text-gray-300"
                    aria-label={`${term.label} 자세히 보기`}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!canPay}
              onClick={handlePay}
              className="mt-10 h-14 w-full rounded-3.5 bg-primary-100 text-body-5-2 text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {isPending ? "결제 페이지를 여는 중..." : "동의하기"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
