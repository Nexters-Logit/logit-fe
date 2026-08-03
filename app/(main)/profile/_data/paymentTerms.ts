export type PaymentTermId = "payapp_service" | "subscription" | "refund" | "credit" | "id_info";

type PaymentTermBase = {
  id: PaymentTermId;
  label: string;
  required: boolean;
};

export type PaymentTerm =
  | (PaymentTermBase & { kind: "external"; href: string })
  | (PaymentTermBase & { kind: "modal"; slug: string });

export const PAYMENT_TERMS: PaymentTerm[] = [
  {
    id: "payapp_service",
    label: "페이앱 서비스 이용 약관",
    required: true,
    kind: "external",
    href: "https://www.payapp.kr/homepage/udidTerms/payapp_terms.html",
  },
  {
    id: "subscription",
    label: "유료서비스 및 정기결제 이용 약관",
    required: true,
    kind: "modal",
    slug: "subscription",
  },
  {
    id: "refund",
    label: "해지 및 환불 정책 동의",
    required: true,
    kind: "modal",
    slug: "cancellation-refund",
  },
  {
    id: "credit",
    label: "개인(신용)정보 제공 동의",
    required: true,
    kind: "modal",
    slug: "personal-info-consent",
  },
  {
    id: "id_info",
    label: "고유식별정보 처리 동의",
    required: true,
    kind: "modal",
    slug: "unique-id-consent",
  },
];
