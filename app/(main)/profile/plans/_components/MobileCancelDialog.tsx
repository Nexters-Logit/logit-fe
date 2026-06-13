"use client";

import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/libs/utils";

export function MobileCancelDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  title = "정말 구독을 취소 하시겠어요?",
  description = "결제는 일시 정지 후 다음 결제에 다시 구독할 수 있어요",
  dismissLabel = "일시정지",
  confirmLabel = "해지하기",
  confirmVariant = "primary",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title?: string;
  description?: string;
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
          <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-7 text-red-400" />
          </div>
        </div>

        <DialogTitle className="mb-2 text-center text-body-5-2 text-gray-500">
          {title}
        </DialogTitle>
        <DialogDescription className="mb-7 text-center text-body-8-3 text-gray-200">
          {description}
        </DialogDescription>

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
