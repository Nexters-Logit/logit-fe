"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/libs/api-client";
import Image from "next/image";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleGoogleLogin = () => {
    const redirectUri =
      typeof window !== "undefined"
        ? encodeURIComponent(window.location.origin + "/auth/callback")
        : "";
    window.location.href = `${API_BASE_URL}/api/v1/auth/google${redirectUri ? `?redirect_uri=${redirectUri}` : ""}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] w-125 flex-col overflow-hidden rounded-2xl border-0 pt-10 px-12 pb-8 shadow-chat sm:max-w-2xl gap-9"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 shrink-0 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Image
            src="/icons/icon-close.svg"
            alt="닫기"
            width={28}
            height={28}
          />
        </button>

        {/* 헤더 */}
        <DialogTitle className="sr-only">로그인</DialogTitle>
        <div className="gap-2 flex flex-col items-center justify-center">
          <Image
            src="/icons/logo_symbol_3d.svg"
            alt="Logit logo"
            width={60}
            height={60}
          />

          <Image
            src="/icons/logo_wordmark.svg"
            alt="logo_wordmark"
            width={64}
            height={32}
          />

          <p className="regular_18 text-black">
            로그인하고 모든 기능을 사용해보세요
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            type="button"
            variant={"outline"}
            onClick={handleGoogleLogin}
            className="h-11 py-2.5 px-6 text-body-5-2 border border-gray-100 w-full"
          >
            <Image
              src="/icons/google_login.svg"
              alt="google_login"
              width={20}
              height={20}
            />
            Google로 시작하기
          </Button>
          <Button
            type="button"
            variant={"outline"}
            className="h-11 px-6 text-body-5-2 border border-gray-100 w-full"
          >
            <Image
              src="/icons/apple_login.svg"
              alt="apple_login"
              width={20}
              height={20}
            />
            Apple로 시작하기
          </Button>
        </div>

        {/* 푸터 */}
        <div className="shrink-0 flex items-center justify-center gap-4 px-8 py-5 border-t border-gray-70">
          <p className="regular_14 text-black">
            계속하면 <span className="bold_14 text-primary-100"> 이용약관</span>{" "}
            ·{" "}
            <span className="bold_14 text-primary-100">개인정보 처리방침</span>
            에 동의합니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
