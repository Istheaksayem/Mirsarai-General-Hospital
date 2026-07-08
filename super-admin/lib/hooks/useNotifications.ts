import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/services/api";
export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: getNotifications, staleTime: 1000 * 60 * 1 });
}
