"use client";

import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, SUB_TYPE_LABEL } from "../_utils/formatPayment";

export function CancelConfirmDialog({
  open,
  subType,
  expiresAt,
  onClose,
  onConfirm,
  isPending,
}: {
  open: boolean;
  subType: string;
  expiresAt: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-3xl p-8">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-400">
          <AlertCircle className="size-6" />
        </div>
        <DialogTitle className="text-title-3 text-gray-500">
          {SUB_TYPE_LABEL[subType] ?? "구독"}을 취소할까요?
        </DialogTitle>
        <DialogDescription className="mt-2 text-body-7-3 text-gray-300">
          {expiresAt
            ? `${formatDate(expiresAt)}까지 계속 이용하실 수 있으며, 이후 자동 갱신이 중단됩니다.`
            : "다음 결제일부터 자동 갱신이 중단됩니다."}
        </DialogDescription>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-3.5 border border-gray-70 py-3 text-body-7-2 text-gray-400 transition-colors hover:bg-gray-20"
          >
            돌아가기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-3.5 bg-red-400 py-3 text-body-7-2 text-white transition-colors hover:bg-red-500 disabled:opacity-60"
          >
            {isPending ? "취소 중..." : "구독 취소"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
