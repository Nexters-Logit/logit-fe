"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ExperienceOptionsMenuProps {
  onShowDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExperienceOptionsMenu({
  onShowDetail,
  onEdit,
  onDelete,
}: ExperienceOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
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
        className="min-w-0 rounded-3.5 p-0 border-0 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] bg-white"
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onShowDetail();
          }}
          className="px-4 py-3.5 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-70"
        >
          <Image src="/icons/icon-expand.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-[#17181E]">전체보기</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="px-4 py-3.5 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-70"
        >
          <Image src="/icons/icon-edit.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-[#17181E]">수정하기</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="px-4 py-3.5 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <Image src="/icons/icon-trash.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-[#17181E]">삭제하기</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
