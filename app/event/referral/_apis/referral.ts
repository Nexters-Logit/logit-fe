import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";

export interface ReferralInfo {
  code: string;
  referral_url: string;
  invited_count: number;
}

export async function getReferralInfo(): Promise<ReferralInfo> {
  return apiFetch<ReferralInfo>(API_ENDPOINTS.referralMe);
}

export async function applyReferralCode(code: string): Promise<void> {
  return apiFetch<void>(API_ENDPOINTS.referralApply, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
