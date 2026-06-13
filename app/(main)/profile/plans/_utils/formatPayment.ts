export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export const PLAN_DISPLAY_NAME: Record<string, string> = {
  lite: "Logit Lite",
  pro: "Logit Pro",
  basic: "MCP Basic",
};

export const PLAN_SHORT_NAME: Record<string, string> = {
  lite: "Lite",
  pro: "Pro",
  basic: "Basic",
};

export const SUB_TYPE_LABEL: Record<string, string> = {
  logit: "Logit 구독",
  mcp: "MCP 구독",
};
