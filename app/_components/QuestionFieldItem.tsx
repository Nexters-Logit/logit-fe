"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";

interface QuestionFieldItemProps {
  index: number;
  questionValue: string;
  maxLengthValue: number | null;
  onQuestionChange: (value: string) => void;
  onMaxLengthChange: (value: number | null) => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export function QuestionFieldItem({
  questionValue,
  maxLengthValue,
  onQuestionChange,
  onMaxLengthChange,
  onRemove,
  showRemoveButton = true,
}: QuestionFieldItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="문항을 입력해주세요"
        className="flex-1 h-10 text-body-5-4"
        value={questionValue}
        onChange={(e) => onQuestionChange(e.target.value)}
      />
      <div className="relative flex items-center">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="글자수"
          className="h-10 w-25 text-body-5-4 text-center pr-7"
          value={maxLengthValue ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            onMaxLengthChange(value ? Number(value) : null);
          }}
        />
        <span className="absolute right-3 text-body-5-4 text-primary-400 pointer-events-none">
          자
        </span>
      </div>
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 size-10 flex items-center justify-center border border-gray-70 rounded-lg hover:bg-gray-20 transition-colors cursor-pointer"
        >
          <Image
            src="/icons/icon-trash-gray.svg"
            alt="삭제"
            width={20}
            height={20}
          />
        </button>
      )}
    </div>
  );
}
