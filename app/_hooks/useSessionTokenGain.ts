import { useQuery } from "@tanstack/react-query";
import { getSessionTokenGain, sessionTokenGainQueryKey } from "@/libs/sessionTokenGain";

export function useSessionTokenGain() {
  return useQuery({
    queryKey: sessionTokenGainQueryKey,
    queryFn: getSessionTokenGain,
    initialData: getSessionTokenGain,
    staleTime: Infinity,
  });
}
