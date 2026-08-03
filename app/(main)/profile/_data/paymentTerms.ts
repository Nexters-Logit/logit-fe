export type PaymentTermId = "subscription" | "refund" | "credit" | "id_info";

export type PaymentTerm = {
  id: PaymentTermId;
  label: string;
  required: boolean;
  slug: string;
};

// 페이앱 자체 약관(전자금융거래 이용약관/개인정보처리방침/정기결제 이용약관)은
// PayApp 결제 페이지에서 별도로 필수 동의를 받으므로 여기서 중복으로 받지 않는다.
export const PAYMENT_TERMS: PaymentTerm[] = [
  {
    id: "subscription",
    label: "유료서비스 및 정기결제 이용 약관",
    required: true,
    slug: "subscription",
  },
  {
    id: "refund",
    label: "해지 및 환불 정책 동의",
    required: true,
    slug: "cancellation-refund",
  },
  {
    id: "credit",
    label: "개인(신용)정보 제공 동의",
    required: true,
    slug: "personal-info-consent",
  },
  {
    id: "id_info",
    label: "고유식별정보 처리 동의",
    required: true,
    slug: "unique-id-consent",
  },
];
