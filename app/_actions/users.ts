"use server";

import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { UserMe } from "@/types/api";

export async function getUsersMe(): Promise<UserMe> {
  return apiFetch<UserMe>(API_ENDPOINTS.usersMe);
}
