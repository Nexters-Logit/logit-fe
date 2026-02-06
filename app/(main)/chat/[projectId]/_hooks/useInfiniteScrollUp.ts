import { useRef, useEffect, useLayoutEffect } from "react";

interface UseInfiniteScrollUpOptions {
  /** 스크롤 컨테이너 ref */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** 더 불러올 데이터가 있는지 */
  hasMore: boolean;
  /** 현재 로딩 중인지 */
  isLoading: boolean;
  /** 추가 데이터 fetch 함수 */
  onLoadMore: () => void;
  /** 첫 번째 아이템 ID (변경 감지용) */
  firstItemId: string | null;
  /** 초기 로드 방지 딜레이 (ms) */
  initialDelay?: number;
}

/**
 * 위로 스크롤 시 이전 데이터를 불러오는 무한 스크롤 훅
 * - IntersectionObserver로 상단 sentinel 감지
 * - 데이터 추가 후 스크롤 위치 자동 복원
 */
export function useInfiniteScrollUp({
  scrollRef,
  hasMore,
  isLoading,
  onLoadMore,
  firstItemId,
  initialDelay = 500,
}: UseInfiniteScrollUpOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    isReady: false,
    isLoading: false,
    prevScrollHeight: 0,
    prevFirstItemId: null as string | null,
  });

  // props → ref 동기화
  useEffect(() => {
    state.current.isLoading = isLoading;
  }, [isLoading]);

  // 초기 로드 방지 (마운트 직후 fetch 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      state.current.isReady = true;
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  // 데이터 추가 후 스크롤 위치 복원
  useLayoutEffect(() => {
    const { prevFirstItemId, prevScrollHeight } = state.current;

    // 첫 번째 아이템이 변경됨 = 위에 새 데이터 추가됨
    if (prevFirstItemId && firstItemId && prevFirstItemId !== firstItemId) {
      const scrollElement = scrollRef.current;
      if (scrollElement && prevScrollHeight > 0) {
        const heightDiff = scrollElement.scrollHeight - prevScrollHeight;
        if (heightDiff > 0) {
          scrollElement.scrollTop = heightDiff;
        }
      }
    }

    state.current.prevFirstItemId = firstItemId;
    state.current.prevScrollHeight = 0;
  }, [firstItemId, scrollRef]);

  // IntersectionObserver 설정
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isReady, isLoading: loading } = state.current;

        if (entry.isIntersecting && isReady && !loading) {
          state.current.isLoading = true;
          state.current.prevScrollHeight = scrollRef.current?.scrollHeight ?? 0;
          onLoadMore();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, scrollRef]);

  return { sentinelRef };
}
