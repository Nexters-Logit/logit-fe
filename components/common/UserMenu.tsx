"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/libs/auth";
import { LogOut } from "lucide-react";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center hover:bg-primary-30 transition-colors cursor-pointer"
          aria-label="사용자 메뉴"
        >
          <div className="w-8 h-8 rounded-full bg-primary-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout()}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
