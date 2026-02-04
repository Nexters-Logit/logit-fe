"use client";

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
  index,
  questionValue,
  maxLengthValue,
  onQuestionChange,
  onMaxLengthChange,
  onRemove,
  showRemoveButton = true,
}: QuestionFieldItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-body-7-2 text-gray-200 shrink-0">
          문항 {index + 1}
        </span>
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-body-9-3 text-alert hover:underline cursor-pointer"
          >
            삭제
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder={`${index + 1}번 문항`}
          className="text-body-5-4"
          value={questionValue}
          onChange={(e) => onQuestionChange(e.target.value)}
        />
        <Input
          type="number"
          placeholder="글자수"
          className="text-body-5-4 w-28"
          value={maxLengthValue ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            onMaxLengthChange(value ? Number(value) : null);
          }}
        />
      </div>
    </div>
  );
}
