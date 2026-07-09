import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/lib/services/api";
export function useAppointments() {
  return useQuery({ queryKey: ["appointments"], queryFn: getAppointments, staleTime: 1000 * 60 * 2 });
}
