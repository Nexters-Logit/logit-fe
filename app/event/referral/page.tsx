import Script from "next/script";
import { ReferralContent } from "./_components/ReferralContent";
import type { ReferralInfo } from "./_apis/referral";

// TODO: 백엔드 API 완성 후 실제 데이터로 교체
const MOCK_REFERRAL: ReferralInfo = {
  code: "LOGIT-ABC123",
  referral_url: "https://app.logit.ai.kr/?ref=LOGIT-ABC123",
  invited_count: 2,
};

export default function ReferralEventPage() {
  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ReferralContent referral={MOCK_REFERRAL} />
    </>
  );
}
