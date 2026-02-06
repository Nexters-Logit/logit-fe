import Image from "next/image";

interface StatusEmptyProps {
  message?: string;
}

export default function StatusEmpty({
  message = "생성된 프로젝트가 없어요",
}: StatusEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-7 w-52">
      <Image
        src="/illustrations/status-empty.svg"
        alt="빈 상태"
        width={80}
        height={80}
      />
      <p className="text-body-6-2 text-gray-100 text-center">{message}</p>
    </div>
  );
}
