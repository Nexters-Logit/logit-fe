"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/libs/utils";

function AlertIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M24 0C37.2546 0 48 10.7455 48 24C48 37.2546 37.2546 48 24 48C10.7455 48 0 37.2546 0 24C7.24826e-08 10.7455 10.7455 7.24873e-08 24 0Z" fill="#FBE0E2"/>
      <path d="M22.3068 31.3398C22.716 30.6311 23.4728 30.1943 24.2912 30.1943C25.5562 30.1944 26.582 31.2204 26.5822 32.4854C26.5822 33.7505 25.5563 34.7763 24.2912 34.7764C23.4728 34.7764 22.716 34.3397 22.3068 33.6309C21.8978 32.9221 21.8977 32.0485 22.3068 31.3398Z" fill="#ED1728"/>
      <path d="M22.5724 15.7178C22.5726 14.769 23.3423 14 24.2912 14C25.24 14.0001 26.0087 14.7691 26.0089 15.7178V25.2637C26.0089 26.2126 25.2401 26.9814 24.2912 26.9814C23.3422 26.9814 22.5725 26.2126 22.5724 25.2637V15.7178Z" fill="#ED1728"/>
    </svg>
  );
}

export function MobileCancelDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  title = "정말 구독을 취소 하시겠어요?",
  description = "결제는 일시 정지 후 다음 결제에 다시 구독할 수 있어요",
  subtext,
  dismissLabel = "취소",
  confirmLabel = "해지하기",
  confirmVariant = "primary",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title?: string;
  description?: string;
  subtext?: string;
  dismissLabel?: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="mx-auto w-full max-w-80 gap-0 rounded-3xl border-0 bg-white p-7 shadow-chat"
      >
        <div className="mb-5 flex justify-center">
          <div className="flex size-12 items-center justify-center">
            <AlertIcon />
          </div>
        </div>

        <DialogTitle className="mb-2 text-center text-body-5-2 text-gray-500">
          {title}
        </DialogTitle>
        <DialogDescription className={cn("text-center text-body-8-3 text-gray-200", subtext ? "mb-1" : "mb-7")}>
          {description}
        </DialogDescription>
        {subtext && (
          <p className="mb-7 text-center medium_13 text-gray-200">
            {subtext}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-2xl bg-gray-70 text-body-7-2 text-gray-400 transition-colors hover:bg-gray-100"
          >
            {dismissLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "h-12 flex-1 rounded-2xl text-body-7-2 text-white transition-colors disabled:opacity-60",
              confirmVariant === "danger"
                ? "bg-red-400 hover:bg-red-500"
                : "bg-primary-100 hover:bg-primary-200",
            )}
          >
            {isPending ? "처리 중..." : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
