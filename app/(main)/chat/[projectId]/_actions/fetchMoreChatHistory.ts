"use server";

import { getChatHistory, CHAT_HISTORY_PAGE_SIZE } from "../_apis/chat";

export async function fetchMoreChatHistory(
  questionId: string,
  cursor: string,
) {
  return getChatHistory(questionId, {
    cursor,
    size: CHAT_HISTORY_PAGE_SIZE,
  });
}
