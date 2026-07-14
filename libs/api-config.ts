const LOCAL_API_BASE_URL = "http://localhost:8000";
const REMOTE_API_BASE_URL = "https://api-dev.logit.ai.kr";

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? LOCAL_API_BASE_URL
    : REMOTE_API_BASE_URL;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  process.env.API_BASE_URL?.trim() ||
  DEFAULT_API_BASE_URL;
