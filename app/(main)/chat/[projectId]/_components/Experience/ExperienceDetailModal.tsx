"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/types/api";

interface ExperienceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience;
  onEdit: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-10">
      <span className="w-25 shrink-0 text-body-7 font-semibold text-gray-200 leading-140">
        {label}
      </span>
      <span className="flex-1 text-body-5 text-primary-500 leading-[1.5] tracking-[-0.32px] whitespace-pre-wrap">
        {value || "-"}
      </span>
    </div>
  );
}

function DateRow({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) {
  const formatDate = (date?: string) => date?.replace(/-/g, ". ") || "-";

  return (
    <div className="flex gap-10">
      <span className="w-25 shrink-0 text-body-7 font-semibold text-gray-200 leading-140">
        시작 날짜
      </span>
      <div className="flex items-center gap-4 text-body-5 tracking-[-0.32px]">
        <span className="text-primary-500 leading-[1.5]">
          {formatDate(startDate)}
        </span>
        <span className="text-gray-200 leading-[1.5]">~</span>
        <span className="text-primary-500 leading-[1.5]">
          {formatDate(endDate) || formatDate(startDate)}
        </span>
      </div>
    </div>
  );
}

export function ExperienceDetailModal({
  open,
  onOpenChange,
  experience,
  onEdit,
}: ExperienceDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-207 max-h-[90vh] flex flex-col overflow-hidden rounded-5 p-0 border-0 shadow-chat bg-white"
        showCloseButton={false}
      >
        {/* 헤더 */}
        <DialogHeader className="shrink-0 pt-7.5 pb-6 px-7.5 flex-row items-start justify-between">
          <DialogTitle className="text-title-2 font-semibold text-primary-500 leading-[1.5] pr-4">
            {experience.title}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="shrink-0 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Image
              src="/icons/icon-close.svg"
              alt="닫기"
              width={28}
              height={28}
            />
          </button>
        </DialogHeader>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-7.5">
          <div className="flex flex-col gap-7.5 max-w-3xl mx-auto">
            {/* 기본 정보 */}
            <div className="flex flex-col gap-3">
              <DetailRow label="경험 종류" value={experience.experience_type} />
              <DetailRow label="경험 유형" value={experience.category} />
              <DateRow
                startDate={experience.start_date}
                endDate={experience.end_date}
              />
            </div>

            {/* STAR 항목 */}
            <div className="flex flex-col gap-7.5">
              <DetailRow
                label="Situation (상황)"
                value={experience.situation}
              />
              <DetailRow label="Task (과제/목표)" value={experience.task} />
              <DetailRow label="Action (행동)" value={experience.action} />
              <DetailRow label="Result (결과)" value={experience.result} />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 flex items-center justify-center px-7.5 py-4 h-25 bg-white rounded-b-5">
          <Button
            type="button"
            onClick={onEdit}
            className="w-41.25 h-11 text-body-4 font-semibold text-white rounded-3.5"
          >
            수정하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
