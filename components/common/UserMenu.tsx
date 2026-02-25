"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAccessToken, logout } from "@/libs/auth";
import { useLoginModal } from "@/app/_components/LoginModalContext";
import { useUserMe } from "@/app/_hooks/useUserMe";
import { LogOut } from "lucide-react";

function Avatar({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className={className}
        unoptimized
      />
    );
  }
  return <div className="w-8 h-8 rounded-full bg-primary-70" />;
}

export function UserMenu() {
  const { setLoginModalOpen } = useLoginModal();
  const [mounted, setMounted] = useState(false);
  const { data: user } = useUserMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && !!getAccessToken();

  if (!mounted) {
    return (
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center hover:bg-primary-30 transition-colors cursor-pointer overflow-hidden"
        aria-label="계정"
      >
        <div className="w-8 h-8 rounded-full bg-primary-70" />
      </button>
    );
  }

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => setLoginModalOpen(true)}
        className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center hover:bg-primary-30 transition-colors cursor-pointer overflow-hidden"
        aria-label="로그인"
      >
        <div className="w-8 h-8 rounded-full bg-primary-70" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center hover:bg-primary-30 transition-colors cursor-pointer overflow-hidden"
          aria-label="사용자 메뉴"
        >
          <Avatar
            src={user?.profile_image_url ?? null}
            alt={user?.full_name ?? "사용자"}
            className="w-8 h-8 rounded-full object-cover"
          />
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
