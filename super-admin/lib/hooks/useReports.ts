import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/lib/services/api";
export function useReports() {
  return useQuery({ queryKey: ["reports"], queryFn: getReports, staleTime: 1000 * 60 * 5 });
}
