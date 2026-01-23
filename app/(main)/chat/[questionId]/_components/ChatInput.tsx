'use client';

import { useRef, useCallback, useState } from 'react';
import type { ChatStatus } from 'ai';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, Loader2, Square } from 'lucide-react';

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
  placeholder = '메시지를 입력하세요...',
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isGenerating = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && !isGenerating) {
        onSubmit(value.trim());
        setValue('');
        // 높이 리셋
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    },
    [value, isGenerating, onSubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        if (value.trim() && !isGenerating) {
          onSubmit(value.trim());
          setValue('');
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }
      }
    },
    [value, isGenerating, onSubmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // 자동 높이 조절
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    },
    []
  );

  const handleButtonClick = useCallback(() => {
    if (isGenerating && onStop) {
      onStop();
    }
  }, [isGenerating, onStop]);

  return (
    <div className="p-7.5 border-t border-gray-70">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isGenerating}
          rows={1}
          className="w-full resize-none rounded-xl border border-gray-70 bg-gray-50 px-4 py-3 pr-12 text-body-5-5 text-gray-400 placeholder:text-gray-200 focus:border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-200 disabled:opacity-50"
          style={{ minHeight: '48px', maxHeight: '200px' }}
        />
        <Button
          type={isGenerating ? 'button' : 'submit'}
          size="icon"
          variant={isGenerating ? 'destructive' : 'default'}
          onClick={isGenerating ? handleButtonClick : undefined}
          disabled={disabled || (!isGenerating && !value.trim())}
          className="absolute right-2 bottom-2 h-8 w-8"
        >
          {status === 'submitted' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isGenerating ? (
            <Square className="h-4 w-4" />
          ) : (
            <CornerDownLeft className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
