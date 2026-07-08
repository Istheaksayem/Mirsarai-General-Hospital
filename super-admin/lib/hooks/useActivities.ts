import { useQuery } from "@tanstack/react-query";
import { getActivities } from "@/lib/services/api";
export function useActivities() {
  return useQuery({ queryKey: ["activities"], queryFn: getActivities, staleTime: 1000 * 60 * 2 });
}
