"use client";

import { Check } from "lucide-react";
import { cn } from "@/libs/utils";

export function TermsCheckbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked
            ? "border-primary-200 bg-primary-200 text-white"
            : "border-gray-100 bg-white text-transparent",
        )}
        aria-hidden="true"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="min-w-0">
        <span className="block text-body-7-2 text-gray-400">{label}</span>
        {description && (
          <span className="mt-1 block text-body-9-3 text-gray-200">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
