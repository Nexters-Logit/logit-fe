import { useEffect, useRef } from "react";
import { showToast } from "@/libs/toast";
import { useTokenBalance } from "./useTokenBalance";

export function useTokenGrantToasts() {
  const signupBonusToastShown = useRef(false);
  const monthlyToastShown = useRef(false);
  const attendanceToastShown = useRef(false);
  const referralToastShown = useRef(false);
  const { data } = useTokenBalance();

  useEffect(() => {
    if (!data) return;

    // 가입 보너스 토스트 (계정 생성 시점에 지급, 이번 세션에서 최초 1회 알림)
    if (data.signup_bonus_amount > 0 && !signupBonusToastShown.current) {
      signupBonusToastShown.current = true;
      showToast.success(`신규 가입 보너스 ${data.signup_bonus_amount}토큰이 지급되었습니다!`);
    }

    // 월 지급 토스트 (이번 세션에서 최초 1회)
    if (data.monthly_grant_amount > 0 && !monthlyToastShown.current) {
      monthlyToastShown.current = true;
      showToast.success(`이번 달 토큰 ${data.monthly_grant_amount}개가 지급되었습니다.`);
    }

    // 출석 토스트 (당일 첫 조회 시 지급, 이번 세션에서 최초 1회 알림)
    if (data.attendance_amount > 0 && !attendanceToastShown.current) {
      attendanceToastShown.current = true;
      showToast.success(`출석 체크로 +${data.attendance_amount} 토큰이 추가되었어요`);
    }

    // 친구 초대 보상 토스트 (초대자 — 친구가 코드를 입력하면 이 시점에 알림)
    if (data.referral_reward_amount > 0 && !referralToastShown.current) {
      referralToastShown.current = true;
      const count = data.referral_reward_count;
      showToast.success(
        count > 1
          ? `친구 초대 보상으로 ${data.referral_reward_amount}토큰이 지급되었습니다! (${count}명 초대)`
          : `친구 초대 보상으로 ${data.referral_reward_amount}토큰이 지급되었습니다!`,
      );
    }
  }, [data]);
}
