import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/libs/toast";
import { addSessionTokenGain } from "@/libs/sessionTokenGain";
import { useTokenBalance } from "./useTokenBalance";

export function useTokenGrantToasts() {
  const monthlyToastShown = useRef(false);
  const referralToastShown = useRef(false);
  const queryClient = useQueryClient();
  const { data } = useTokenBalance();

  useEffect(() => {
    if (!data) return;

    // 로그인 시 지급된 토큰 토스트 (auth 콜백에서 sessionStorage에 저장한 값)
    const pendingGrants = sessionStorage.getItem("pending_token_grants");
    if (pendingGrants) {
      sessionStorage.removeItem("pending_token_grants");
      const { signup_bonus, monthly, attendance } = JSON.parse(pendingGrants) as {
        signup_bonus: number;
        monthly: number;
        attendance: number;
      };
      if (signup_bonus > 0) {
        showToast.success(`신규 가입 보너스 ${signup_bonus}토큰이 지급되었습니다!`);
      }
      if (monthly > 0) {
        showToast.success(`이번 달 토큰 ${monthly}개가 지급되었습니다.`);
      }
      if (attendance > 0) {
        showToast.success(`출석 체크로 +${attendance} 토큰이 추가되었어요`);
      }
      addSessionTokenGain(signup_bonus + monthly + attendance, queryClient);
      return;
    }

    // 기존 유저 월 지급 토스트 (이번 세션에서 최초 1회)
    if (data.monthly_grant_received && !monthlyToastShown.current) {
      monthlyToastShown.current = true;
      showToast.success(`이번 달 토큰 ${data.monthly_grant_amount}개가 지급되었습니다.`);
      addSessionTokenGain(data.monthly_grant_amount, queryClient);
    }

    // 친구 초대 보상 토스트 (초대자 — 친구가 코드를 입력하면 이 시점에 알림)
    if (data.referral_reward_received && !referralToastShown.current) {
      referralToastShown.current = true;
      const count = data.referral_reward_count;
      showToast.success(
        count > 1
          ? `친구 초대 보상으로 ${data.referral_reward_amount}토큰이 지급되었습니다! (${count}명 초대)`
          : `친구 초대 보상으로 ${data.referral_reward_amount}토큰이 지급되었습니다!`,
      );
      addSessionTokenGain(data.referral_reward_amount, queryClient);
    }
  }, [data, queryClient]);
}
