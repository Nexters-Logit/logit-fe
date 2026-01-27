import Image from "next/image";
import { MessageResponse } from "@/components/ai-elements/message";
import { AIAvatar } from "./AIAvatar";

interface AIMessageProps {
  content: string;
  isDraft?: boolean;
  chatId?: string;
  onUpdateDraft?: (chatId: string) => void;
}

export function AIMessage({
  content,
  isDraft,
  chatId,
  onUpdateDraft,
}: AIMessageProps) {
  return (
    <div className="flex gap-5 items-start py-2">
      <AIAvatar />
      <div className="flex-1 flex flex-col gap-4.5">
        <div className="py-4 text-body-6-1 text-gray-400 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <MessageResponse>{content}</MessageResponse>
        </div>
        {isDraft && chatId && onUpdateDraft && (
          <button
            onClick={() => onUpdateDraft(chatId)}
            className="flex items-center gap-1.5 pl-3 pr-4 py-1.5 border border-primary-400 rounded-xl text-body-8-1 text-primary-400 hover:bg-gray-20 transition-colors w-fit cursor-pointer"
          >
            <Image src="/icons/autorenew.svg" alt="" width={16} height={16} />
            자기소개서 업데이트
          </button>
        )}
      </div>
    </div>
  );
}
