import Script from "next/script";
import { redirect } from "next/navigation";
import { getReferralInfo } from "./_apis/referral";
import { ReferralContent } from "./_components/ReferralContent";

export default async function ReferralEventPage() {
  let referral;
  try {
    referral = await getReferralInfo();
  } catch {
    redirect("/login");
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ReferralContent referral={referral} />
    </>
  );
}
