'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { ChatStatus } from 'ai';
import { Loader2, Square } from 'lucide-react';

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
  placeholder = '메세지를 입력하세요',
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isGenerating = status === 'submitted' || status === 'streaming';
  const hasValue = value.trim().length > 0;

  const resetTextarea = () => {
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const buttonStyles = [
    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors',
    hasValue && !isGenerating
      ? 'bg-primary-100 hover:bg-primary-200'
      : 'bg-gray-20 disabled:cursor-not-allowed',
  ].join(' ');

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
        style={{ minHeight: '26px', maxHeight: '200px' }}
      />
      <button
        type={isGenerating ? 'button' : 'submit'}
        onClick={isGenerating ? onStop : undefined}
        disabled={disabled || (!isGenerating && !hasValue)}
        className={buttonStyles}
      >
        {status === 'submitted' ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : isGenerating ? (
          <Square className="w-4 h-4 text-gray-200" />
        ) : (
          <Image
            src="/icons/send.svg"
            alt="전송"
            width={19}
            height={19}
            className={!hasValue ? 'opacity-40' : ''}
          />
        )}
      </button>
    </form>
  );
}
