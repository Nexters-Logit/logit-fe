"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { useUserMe } from "@/app/_hooks/useUserMe";
import { TermsCheckbox } from "@/components/common/TermsCheckbox";
import type { PlanData } from "@/types/api";

const PAYMENT_TERMS = [
  { id: "payapp_service", label: "페이앱 서비스 이용 약관", required: true },
  { id: "subscription", label: "유료서비스 및 정기결제 이용 약관", required: true },
  { id: "refund", label: "해지 및 환불 정책 동의", required: false },
  { id: "credit", label: "개인(신용)정보 제공 동의", required: false },
  { id: "id_info", label: "고유식별정보 처리 동의", required: false },
] as const;

type TermId = (typeof PAYMENT_TERMS)[number]["id"];

function formatPhoneDigits(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
}

type Props = {
  plan: PlanData | null;
  onClose: () => void;
};

export function AccountPaymentDialog({ plan, onClose }: Props) {
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

  const allChecked = PAYMENT_TERMS.every((t) => checkedTerms.has(t.id));
  const requiredIds = PAYMENT_TERMS.filter((t) => t.required).map((t) => t.id);
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
    setCheckedTerms(allChecked ? new Set() : new Set(PAYMENT_TERMS.map((t) => t.id)));
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    setPhone(formatPhoneDigits(digits));
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
            subscription_type: plan.subscription_type,
            plan: plan.plan_key,
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
    <Dialog open={!!plan} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-130 rounded-3xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <DialogTitle className="text-title-3 text-gray-500">결제하기</DialogTitle>
            <DialogDescription className="mt-1.5 text-body-7-3 text-gray-200">
              휴대폰 번호를 입력하고 결제 정보 이용 약관에 동의해주세요.
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-300 transition-colors hover:bg-gray-20"
            aria-label="닫기"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6">
          <label
            htmlFor="web-payment-phone"
            className="mb-2 block text-body-7-2 text-gray-400"
          >
            결제 알림을 받을 휴대폰 번호
          </label>
          <Input
            id="web-payment-phone"
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

        <div className="mt-6">
          <div className="border-b border-gray-70 pb-4">
            <TermsCheckbox
              checked={allChecked}
              onChange={toggleAll}
              label="약관 모두 동의하기"
            />
          </div>
          <div className="flex flex-col gap-3.5 pt-4">
            {PAYMENT_TERMS.map((term) => (
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
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            disabled={!canPay}
            onClick={handlePay}
            className="h-12 w-48 rounded-3.5 bg-primary-100 text-body-5-2 text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            {isPending ? "결제 페이지를 여는 중..." : "다음으로"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
