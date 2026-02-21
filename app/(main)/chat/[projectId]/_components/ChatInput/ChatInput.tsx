"use client";

import { useRef, useState, useEffect } from "react";
import type { ChatStatus } from "ai";
import { Loader2, Square } from "lucide-react";

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19.3037 19.3026"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.2024 2.20656C19.676 0.896492 18.4065 -0.373013 17.0964 0.101681L1.08511 5.89229C-0.22934 6.36808 -0.388302 8.16161 0.820907 8.86214L5.93181 11.821L10.4957 7.25717C10.7024 7.05747 10.9794 6.94697 11.2668 6.94947C11.5542 6.95197 11.8292 7.06726 12.0325 7.27053C12.2357 7.47379 12.351 7.74875 12.3535 8.03619C12.356 8.32364 12.2455 8.60056 12.0458 8.80733L7.48197 13.3712L10.442 18.4821C11.1414 19.6913 12.9349 19.5312 13.4107 18.2179L19.2024 2.20656Z"
        fill={active ? "white" : "#989CB2"}
      />
    </svg>
  );
}

interface ChatInputProps {
  onSubmit: (text: string) => void;
  status?: ChatStatus;
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSubmit,
  status,
  onStop,
  placeholder = "메세지를 입력하세요",
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isGenerating = status === "submitted" || status === "streaming";
  const hasValue = value.trim().length > 0;
  const prevStatusRef = useRef<ChatStatus | undefined>(status);

  // 스트리밍 완료 후 input에 자동 focus
  useEffect(() => {
    const wasGenerating =
      prevStatusRef.current === "submitted" ||
      prevStatusRef.current === "streaming";
    const isNowReady = status === "ready" || status === "error";

    if (wasGenerating && isNowReady) {
      textareaRef.current?.focus();
    }

    prevStatusRef.current = status;
  }, [status]);

  const resetTextarea = () => {
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const submitMessage = () => {
    if (value.trim() && !isGenerating) {
      onSubmit(value.trim());
      resetTextarea();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const renderButtonIcon = () => {
    if (status === "submitted") {
      return <Loader2 className="w-5 h-5 text-primary-100 animate-spin" />;
    }

    if (isGenerating) {
      return <Square className="w-4 h-4 text-gray-200" />;
    }

    return <SendIcon active={hasValue} />;
  };

  const buttonStyles = [
    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors",
    hasValue && !isGenerating
      ? "bg-primary-100 hover:bg-primary-200"
      : "bg-gray-20 disabled:cursor-not-allowed",
  ].join(" ");

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white border border-gray-100 rounded-3.5 px-5 py-3.5 shadow-chat"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isGenerating}
        rows={1}
        className="flex-1 resize-none bg-transparent text-body-5-3 text-gray-500 placeholder:text-gray-200 focus:outline-none disabled:opacity-50"
        style={{ minHeight: "26px", maxHeight: "200px" }}
      />
      <button
        type={isGenerating ? "button" : "submit"}
        onClick={isGenerating ? onStop : undefined}
        disabled={disabled || (!isGenerating && !hasValue)}
        className={buttonStyles}
      >
        {renderButtonIcon()}
      </button>
    </form>
  );
}
