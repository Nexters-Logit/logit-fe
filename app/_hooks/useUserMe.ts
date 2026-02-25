import { useQuery } from "@tanstack/react-query";
import { getUsersMe } from "@/app/_actions/users";
import { getAccessToken } from "@/libs/auth";

export function useUserMe() {
  return useQuery({
    queryKey: ["userMe"],
    queryFn: getUsersMe,
    enabled: !!getAccessToken(),
  });
}
