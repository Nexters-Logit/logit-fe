import { AIAvatar } from "./AIAvatar";

export function ChatLoadingIndicator() {
  return (
    <div className="flex gap-5 items-start">
      <AIAvatar />
      <div className="flex items-center gap-1.5 py-2">
        <span className="text-body-6-1 text-gray-300">답변 작성 중</span>
        <div className="flex items-center gap-0.5">
          {[0, 0.2, 0.4].map((delay) => (
            <span
              key={delay}
              className="w-1 h-1 bg-primary-100 rounded-full animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
