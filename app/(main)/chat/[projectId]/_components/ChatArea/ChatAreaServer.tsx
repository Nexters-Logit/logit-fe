import { getChatHistory, CHAT_HISTORY_PAGE_SIZE } from "../../_apis/chat";
import { validateChatHistory } from "../../_utils";
import { ChatAreaClient } from "./ChatAreaClient";

interface ChatAreaServerProps {
  questionId: string;
}

export async function ChatAreaServer({ questionId }: ChatAreaServerProps) {
  const rawChatHistory = await getChatHistory(questionId, {
    size: CHAT_HISTORY_PAGE_SIZE,
  }).catch((error) => {
    console.error("Failed to fetch chat history:", error);
    return null;
  });

  const chatHistory = validateChatHistory(rawChatHistory);

  return <ChatAreaClient questionId={questionId} chatHistory={chatHistory} />;
}
