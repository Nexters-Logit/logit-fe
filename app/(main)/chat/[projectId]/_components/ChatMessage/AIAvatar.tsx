import Image from "next/image";

export function AIAvatar() {
  return (
    <div className="w-8.5 h-8.5 shrink-0">
      <Image src="/icons/ai-logo.svg" alt="AI" width={34} height={34} />
    </div>
  );
}
