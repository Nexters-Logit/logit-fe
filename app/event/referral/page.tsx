import type { Metadata } from "next";
import Script from "next/script";
import { ReferralContent } from "./_components/ReferralContent";

export const metadata: Metadata = {
  title: "친구 초대 이벤트",
  description: "친구를 초대하고 함께 토큰을 받아요.",
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
      <ReferralContent />
    </>
  );
}
