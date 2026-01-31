"use client";

import { useEffect } from "react";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Chat Page Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center p-7.5">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-title-3 text-gray-400 mb-2">
            페이지를 불러올 수 없습니다
          </h1>

          <p className="text-body-5-5 text-gray-300 mb-6">
            일시적인 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>

          {error.message && (
            <p className="text-body-7-3 text-gray-200 mb-6 p-3 bg-gray-50 rounded-lg">
              {error.message}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              이전으로
            </Button>
            <Button onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
