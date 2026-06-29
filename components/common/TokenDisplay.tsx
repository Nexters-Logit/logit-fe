"use client";

import Link from "next/link";
import { Plus, Zap } from "lucide-react";
import { useTokenBalance } from "@/app/_hooks/useTokenBalance";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";

export function TokenDisplay() {
  const { data: user } = useCurrentUser();
  const { data } = useTokenBalance();

  if (!user) return null;

  const balance = data?.balance ?? "–";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-3.5 bg-primary-20">
        <Zap className="size-3.5 text-primary-400" strokeWidth={2} />
        <span className="text-body-5-3 text-primary-600 tabular-nums">{balance}</span>
      </div>
      <Link
        href="/profile"
        className="flex items-center justify-center size-6 rounded-full bg-primary-20 hover:bg-primary-30 transition-colors"
        aria-label="토큰 충전 (계정관리)"
      >
        <Plus className="size-3.5 text-primary-400" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
