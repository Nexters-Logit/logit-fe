"use client";

import { CircleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experienceTitle: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteExperienceDialog({
  open,
  onOpenChange,
  experienceTitle,
  onConfirm,
  isPending = false,
}: DeleteExperienceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-100.5 rounded-5 p-0 border-0 shadow-chat bg-white"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-7.5 px-7.5 pt-10 pb-7.5">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center justify-center size-15 rounded-full bg-alert/10">
              <CircleAlert className="size-7.5 text-alert" />
            </div>

            <DialogHeader className="items-center gap-1">
              <DialogTitle className="text-title-2-2 text-gray-500 text-center">
                경험을 삭제하시겠어요?
              </DialogTitle>
              <DialogDescription className="text-body-6-2 text-gray-200 text-center">
                &apos;{experienceTitle}&apos; 삭제된 경험은 복구할 수 없습니다.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 h-10 bg-gray-50 text-gray-400 rounded-lg text-body-5-2 cursor-pointer hover:bg-gray-70 transition-colors disabled:opacity-50"
            >
              취소하기
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 h-10 bg-primary-100 text-white rounded-lg text-body-5-2 cursor-pointer hover:bg-primary-200 transition-colors disabled:opacity-50"
            >
              {isPending ? "삭제 중..." : "삭제하기"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
