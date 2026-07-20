"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ChatProjectSummaryKebabProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ChatProjectSummaryKebab({
  onEdit,
  onDelete,
}: ChatProjectSummaryKebabProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="size-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Image
            src="/icons/icon-more-vertical.svg"
            alt="옵션"
            width={20}
            height={20}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-0 rounded-3.5 p-0 border-0 shadow-dropdown bg-white"
      >
        <DropdownMenuItem
          onClick={onEdit}
          className="px-5 py-3.75 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <Image src="/icons/icon-edit.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-primary-600">수정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="px-5 py-3.75 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <Image src="/icons/icon-trash.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-primary-600">삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
