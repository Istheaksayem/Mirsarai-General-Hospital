import { useQuery } from "@tanstack/react-query";
import { getPrescriptions } from "@/lib/services/api";
export function usePrescriptions() {
  return useQuery({ queryKey: ["prescriptions"], queryFn: getPrescriptions, staleTime: 1000 * 60 * 5 });
}
