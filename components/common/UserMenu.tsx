"use client";

import { forwardRef } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/libs/auth";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { useLoginModal } from "@/app/_components/LoginModalContext";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";
import { Link2, LogOut } from "lucide-react";

const AvatarButton = forwardRef<
  HTMLButtonElement,
  {
    profileImageUrl?: string | null;
    label: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function AvatarButton({ profileImageUrl, label, ...props }, ref) {
  if (profileImageUrl) {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        className="w-10 h-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
        aria-label={label}
      >
        <Image
          src={profileImageUrl}
          alt="프로필"
          width={40}
          height={40}
          className="w-10 h-10 object-cover"
        />
      </button>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center hover:bg-primary-30 transition-colors cursor-pointer"
      aria-label={label}
    >
      <div className="w-8 h-8 rounded-full bg-primary-70" />
    </button>
  );
});

async function handleCopyMcpToken() {
  try {
    const data = await apiFetch<{ token: string }>(API_ENDPOINTS.mcpToken);
    await navigator.clipboard.writeText(data.token);
    showToast.success("MCP 토큰이 복사되었습니다");
  } catch {
    showToast.error("MCP 토큰 복사에 실패했습니다");
  }
}

export function UserMenu() {
  const { setLoginModalOpen } = useLoginModal();
  const { data: user } = useCurrentUser();

  if (!user) {
    return (
      <AvatarButton
        label="로그인"
        onClick={() => setLoginModalOpen(true)}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarButton
          profileImageUrl={user?.profile_image_url}
          label="사용자 메뉴"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-0 rounded-3.5 p-0 border-0 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] bg-white"
      >
        <DropdownMenuItem
          onClick={() => handleCopyMcpToken()}
          className="px-5 py-3.75 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <Link2 className="size-4.5 text-primary-600" />
          <span className="text-body-5-3 text-primary-600">MCP 토큰 복사</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout()}
          className="px-5 py-3.75 gap-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <LogOut className="size-4.5 text-primary-600" />
          <span className="text-body-5-3 text-primary-600">로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
