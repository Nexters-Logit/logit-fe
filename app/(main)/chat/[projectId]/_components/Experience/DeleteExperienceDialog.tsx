"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        className="sm:max-w-100 rounded-5 p-0 border-0 shadow-chat bg-white"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-4 pt-8 pb-6 px-6">
          {/* 아이콘 */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-alert/10">
            <Trash2 className="size-7 text-alert" />
          </div>

          {/* 텍스트 */}
          <DialogHeader className="items-center gap-2">
            <DialogTitle className="text-title-3 font-semibold text-primary-500 text-center">
              경험을 삭제하시겠습니까?
            </DialogTitle>
            <DialogDescription className="text-body-6 text-gray-200 text-center">
              &apos;{experienceTitle}&apos;
              <br />
              삭제된 경험은 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 버튼 */}
        <DialogFooter className="px-6 pb-6 gap-3 sm:justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1 h-11 text-body-5-2 rounded-3.5"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-11 text-body-5-2 bg-alert hover:bg-alert/90 text-white rounded-3.5"
          >
            {isPending ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
