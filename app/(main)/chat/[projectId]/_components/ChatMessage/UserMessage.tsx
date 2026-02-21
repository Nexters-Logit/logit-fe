interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-180 bg-primary-20 rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-sm px-6 py-2.5">
        <p className="text-body-6-1 text-gray-500">{content}</p>
      </div>
    </div>
  );
}
