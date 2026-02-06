import { useState, useCallback } from "react";
import { fetchMoreChatHistory } from "../_actions/fetchMoreChatHistory";
import { convertToUIMessages } from "../_utils";
import type { UIMessage } from "@ai-sdk/react";

interface UseChatHistoryPaginationOptions {
  questionId: string;
  initialHasMore?: boolean;
  initialCursor: string | null;
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
}

export function useChatHistoryPagination({
  questionId,
  initialHasMore = false,
  initialCursor,
  messages,
  setMessages,
}: UseChatHistoryPaginationOptions) {
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [isFetching, setIsFetching] = useState(false);

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetching || !nextCursor) return;

    setIsFetching(true);
    try {
      const response = await fetchMoreChatHistory(questionId, nextCursor);

      const existingIds = new Set(messages.map((m) => m.id));
      const newChats = response.chats.filter((c) => !existingIds.has(c.id));

      if (newChats.length > 0) {
        const newUIMessages = convertToUIMessages(newChats);
        setMessages([...newUIMessages, ...messages]);
      }

      setHasMore(response.has_more);
      setNextCursor(response.next_cursor);
    } finally {
      setIsFetching(false);
    }
  }, [hasMore, isFetching, nextCursor, questionId, messages, setMessages]);

  return {
    hasMore,
    isFetching,
    fetchMore,
  };
}
