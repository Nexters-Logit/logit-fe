"use client";

import { IMaskInput } from "react-imask";
import { cn } from "@/libs/utils";

interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

export function DateInput({
  value,
  onChange,
  onBlur,
  name,
  placeholder = "YYYY.MM.DD",
  className,
  disabled,
  "aria-invalid": ariaInvalid,
}: DateInputProps) {
  return (
    <IMaskInput
      mask="0000.00.00"
      lazy
      value={value}
      onAccept={(val: string) => onChange(val)}
      onBlur={onBlur}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-gray-70 focus:border-primary-200 caret-primary-100 h-11 w-full min-w-0 rounded-lg border bg-transparent px-5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-alert/20 aria-invalid:border-alert",
        className,
      )}
    />
  );
}
