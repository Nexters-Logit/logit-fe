import Image from "next/image";
import { AIAvatar } from "./AIAvatar";

interface ChatErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("too many")
  ) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  if (message.includes("401") || message.includes("unauthorized")) {
    return "인증이 만료되었습니다. 다시 로그인해주세요.";
  }
  if (message.includes("403") || message.includes("forbidden")) {
    return "접근 권한이 없습니다.";
  }
  if (message.includes("500") || message.includes("server")) {
    return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "네트워크 연결을 확인해주세요.";
  }

  return "오류가 발생했습니다. 다시 시도해주세요.";
}

export function ChatErrorMessage({ error, onRetry }: ChatErrorMessageProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex gap-5 items-start py-4">
      <AIAvatar />
      <div className="flex-1 flex flex-col gap-4 max-w-lg">
        <div className="py-3 px-5 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-body-6-1 text-red-600">{errorMessage}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 pl-3 pr-4 py-1.5 border border-gray-200 rounded-xl text-body-8-1 text-gray-400 hover:bg-gray-20 transition-colors w-fit cursor-pointer"
          >
            <Image src="/icons/autorenew.svg" alt="" width={16} height={16} />
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
