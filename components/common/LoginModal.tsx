"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { startOAuthLogin } from "@/libs/auth";
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
    startOAuthLogin("google");
  };

  const handleAppleLogin = () => {
    startOAuthLogin("apple");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-modal w-125 flex-col overflow-hidden rounded-5 border-0 pt-10 px-12.5 pb-7.5 shadow-chat sm:max-w-2xl gap-9"
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
            src="/icons/logo_symbol_3d.webp"
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
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="relative flex items-center justify-center w-full rounded-3.5 border border-gray-100 bg-white py-2.5 px-5.5 regular_19 text-black cursor-pointer hover:bg-accent transition-colors"
          >
            <Image
              src="/icons/google_login.svg"
              alt="google_login"
              width={22}
              height={22}
              className="absolute left-3.75"
            />
            Google로 시작하기
          </button>
          <button
            type="button"
            onClick={handleAppleLogin}
            className="relative flex items-center justify-center w-full rounded-3.5 border border-gray-100 bg-white py-2.5 px-5.5 regular_19 text-black cursor-pointer hover:bg-accent transition-colors"
          >
            <Image
              src="/icons/apple_login.svg"
              alt="apple_login"
              width={22}
              height={22}
              className="absolute left-3.75"
            />
            Apple로 시작하기
          </button>
        </div>

        {/* 푸터 */}
        <p className="regular_13 text-black opacity-70 text-center">
          계속하면{" "}
          <a
            href="https://docs.logit.ai.kr/policys/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary-100 underline"
          >
            이용약관
          </a>
          {" · "}
          <a
            href="https://docs.logit.ai.kr/policys/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary-100 underline"
          >
            개인정보 처리방침
          </a>
          에 동의합니다.
        </p>
      </DialogContent>
    </Dialog>
  );
}
