"use client";

import { PenLine, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ExperienceOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
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
          className="p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
            onEdit();
          }}
          className="px-5 py-3.75 gap-3 cursor-pointer focus:bg-gray-30"
        >
          <PenLine className="size-4.5 text-gray-300" />
          <span className="text-body-5 font-medium text-gray-300">수정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="px-5 py-3.75 gap-3 cursor-pointer focus:bg-gray-30"
        >
          <Trash2 className="size-4.5 text-gray-300" />
          <span className="text-body-5 font-medium text-gray-300">삭제</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
