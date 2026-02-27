"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ExperienceOptionsMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExperienceOptionsMenu({
  onEdit,
  onDelete,
}: ExperienceOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src="/icons/vertical_menu.svg"
            alt="옵션"
            width={40}
            height={40}
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
            onEdit?.();
          }}
          className="px-5 py-3.75 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <Image src="/icons/icon-edit.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-primary-600">수정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="px-5 py-3.75 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <Image src="/icons/icon-trash.svg" alt="" width={18} height={18} />
          <span className="text-body-5-3 text-primary-600">삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
