import Image from "next/image";

export function ChatEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-7">
      <Image
        src="/icons/ai-logo.svg"
        alt=""
        width={80}
        height={80}
        className="opacity-30"
      />
      <p className="text-body-6-2 text-gray-100 text-center">
        경험을 선택하면 초안이 생성돼요
      </p>
    </div>
  );
}
