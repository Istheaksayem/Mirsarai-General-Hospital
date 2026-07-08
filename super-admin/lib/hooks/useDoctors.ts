import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/lib/services/api";
export function useDoctors() {
  return useQuery({ queryKey: ["doctors"], queryFn: getDoctors, staleTime: 1000 * 60 * 5 });
}
