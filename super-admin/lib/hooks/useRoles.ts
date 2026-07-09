import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/services/api";
export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: getRoles, staleTime: 1000 * 60 * 10 });
}
