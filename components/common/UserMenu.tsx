"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/libs/auth";
import { useLoginModal } from "@/components/common/LoginModalContext";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";
import { LogOut } from "lucide-react";

function AvatarButton({
  profileImageUrl,
  label,
  ref,
  ...props
}: {
  profileImageUrl?: string | null;
  label: string;
  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
}

export function UserMenu() {
  const { setLoginModalOpen } = useLoginModal();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <button
        type="button"
        onClick={() => setLoginModalOpen(true)}
        className="px-4 py-2 rounded-3.5 bg-primary-300 text-white text-body-5-3 cursor-pointer hover:bg-primary-200 transition-colors"
      >
        로그인
      </button>
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
        className="min-w-0 rounded-3.5 p-0 border-0 shadow-dropdown bg-white"
      >
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
