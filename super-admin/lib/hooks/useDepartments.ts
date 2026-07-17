import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/lib/services/api";
export function useDepartments() {
  return useQuery({ queryKey: ["departments"], queryFn: getDepartments, staleTime: 1000 * 60 * 5 });
}
