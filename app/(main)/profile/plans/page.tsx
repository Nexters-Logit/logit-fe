import type { Metadata } from "next";
import { PlansPageClient } from "./_components/PlansPageClient";

export const metadata: Metadata = {
  title: "요금제",
  description: "Logit 요금제를 확인하고 선택하세요.",
};

export default function PlansPage() {
  return <PlansPageClient />;
}
