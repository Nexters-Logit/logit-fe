"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCategoryConfig } from "../../_constants";
import { EXPERIENCE_TYPE_MONO_ICON } from "@/app/_constants/experienceTypes";
import { FORMAT_TYPE, type Experience, type ExperienceType } from "@/types/api";

interface ExperienceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience;
  onEdit: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-10">
      <span className="w-25 shrink-0 text-body-7 font-semibold text-gray-200 leading-140 break-keep">
        {label}
      </span>
      <span className="flex-1 text-body-5-4 text-gray-500 whitespace-pre-wrap break-keep">
        {value || "-"}
      </span>
    </div>
  );
}

function CategoryRow({ category }: { category: string }) {
  const config = getCategoryConfig(category);

  return (
    <div className="flex items-start gap-10">
      <span className="w-25 shrink-0 text-body-7 font-semibold text-gray-200 leading-140">
        경험 유형
      </span>
      <div className="flex items-center gap-3.75">
        <div className="size-6 shrink-0 flex items-center justify-center">
          <Image src={config.icon} alt="" width={15} height={15} />
        </div>
        <span className="text-body-5-4 text-gray-500">{category}</span>
      </div>
    </div>
  );
}

function DateRow({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string | null;
}) {
  const formatDate = (date?: string | null) => date?.replace(/-/g, ". ") || "-";

  return (
    <div className="flex items-start gap-10">
      <span className="w-25 shrink-0 text-body-7 font-semibold text-gray-200 leading-140">
        시작 날짜
      </span>
      <div className="flex items-center gap-4 text-body-5-4">
        <span className="text-gray-500">{formatDate(startDate)}</span>
        <span className="text-gray-200">~</span>
        <span className="text-gray-500">
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
        className="sm:max-w-207 h-175 flex flex-col overflow-hidden rounded-5 p-0 border-0 shadow-chat bg-white"
        showCloseButton={false}
      >
        {/* 헤더 */}
        <DialogHeader className="shrink-0 pt-7.5 pb-6 px-7.5 flex-row items-start justify-between">
          <DialogTitle className="text-title-2-2 text-gray-500 pr-4">
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
          <div className="flex flex-col gap-7.5">
            {/* 기본 정보 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-10">
                <span className="w-25 shrink-0 text-body-7 font-semibold text-gray-200 leading-140 break-keep">
                  경험 종류
                </span>
                <div className="flex items-center gap-3.75">
                  <div className="size-6 shrink-0 flex items-center justify-center">
                    <Image
                      src={
                        EXPERIENCE_TYPE_MONO_ICON[
                          experience.experience_type as ExperienceType
                        ]
                      }
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-body-5-4 text-gray-500">
                    {experience.experience_type}
                  </span>
                </div>
              </div>
              <CategoryRow category={experience.category} />
              <DateRow
                startDate={experience.start_date}
                endDate={experience.end_date}
              />
            </div>

            {/* format_type별 컨텐츠 */}
            {experience.format_type === FORMAT_TYPE.STAR && (
              <div className="flex flex-col gap-7.5">
                <DetailRow
                  label="Situation (상황)"
                  value={experience.situation ?? ""}
                />
                <DetailRow
                  label="Task (과제/목표)"
                  value={experience.task ?? ""}
                />
                <DetailRow
                  label="Action (행동)"
                  value={experience.action ?? ""}
                />
                <DetailRow
                  label="Result (결과)"
                  value={experience.result ?? ""}
                />
              </div>
            )}
            {experience.format_type === FORMAT_TYPE.PSI && (
              <div className="flex flex-col gap-7.5">
                <DetailRow
                  label="Problem (문제)"
                  value={experience.problem ?? ""}
                />
                <DetailRow
                  label="Solution (접근)"
                  value={experience.solution ?? ""}
                />
                <DetailRow
                  label="Insight (배움)"
                  value={experience.insight ?? ""}
                />
              </div>
            )}
            {experience.format_type === FORMAT_TYPE.FREE && (
              <div className="flex flex-col gap-7.5">
                <DetailRow label="경험 기입" value={experience.content ?? ""} />
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 flex items-center justify-center px-7.5 py-4 h-25 bg-white rounded-b-5">
          <Button
            type="button"
            onClick={onEdit}
            className="w-41.25 h-11 text-body-3-2 text-white rounded-3.5"
          >
            수정하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
