"use client";

interface CompleteToggleButtonProps {
  isCompleted: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8 12L11 15L16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CompleteToggleButton({
  isCompleted,
  onClick,
  disabled,
}: CompleteToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-25 items-center justify-center gap-1.5 rounded-lg border pl-2 pr-2.5 py-1.25 text-body-7-1 transition-colors cursor-pointer ${
        isCompleted
          ? "bg-primary-20 border-primary-100 text-primary-100 hover:bg-primary-50"
          : "border-gray-100 text-gray-200 hover:bg-gray-50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <CheckIcon />
      <span>작성완료</span>
    </button>
  );
}
