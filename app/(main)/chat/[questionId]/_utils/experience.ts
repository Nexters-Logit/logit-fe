/**
 * 경험 태그 문자열을 배열로 파싱
 * JSON 배열 또는 쉼표로 구분된 문자열 지원
 */
export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];

  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
}
