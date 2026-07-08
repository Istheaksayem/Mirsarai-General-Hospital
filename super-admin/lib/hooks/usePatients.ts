import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/lib/services/api";
export function usePatients() {
  return useQuery({ queryKey: ["patients"], queryFn: getPatients, staleTime: 1000 * 60 * 5 });
}
