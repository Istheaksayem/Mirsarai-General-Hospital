import { useQuery } from "@tanstack/react-query";
import { getBilling } from "@/lib/services/api";
export function useBilling() {
  return useQuery({ queryKey: ["billing"], queryFn: getBilling, staleTime: 1000 * 60 * 5 });
}
