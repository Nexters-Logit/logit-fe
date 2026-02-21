"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StepFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export function StepFormModal({
  open,
  onOpenChange,
  onClose,
  step,
  totalSteps,
  title,
  description,
  headerExtra,
  children,
}: StepFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-chat sm:max-w-2xl"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
        onEscapeKeyDown={onClose}
      >
        <div className="shrink-0 px-8 pt-6 pb-7 gap-1.5">
          <DialogHeader className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-0 right-0 shrink-0 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image
                src="/icons/icon-close.svg"
                alt="닫기"
                width={28}
                height={28}
              />
            </button>
            <p className="text-body-7-2 text-primary-400 font-semibold">
              {step}/{totalSteps}
            </p>
            <DialogTitle className="text-title-2-2 text-gray-400">
              {title}
            </DialogTitle>
            {headerExtra ? (
              <div className="flex justify-between items-center">
                <DialogDescription className="text-body-7-2 text-primary-400">
                  {description}
                </DialogDescription>
                {headerExtra}
              </div>
            ) : (
              <DialogDescription className="text-body-7-2 text-primary-400">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        {children}
      </DialogContent>
    </Dialog>
  );
}
