import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, type DashboardRole } from "@/lib/services/api";
export function useDashboard(role: DashboardRole) {
  return useQuery({ queryKey: ["dashboard", role], queryFn: () => getDashboardStats(role), staleTime: 1000 * 60 * 5 });
}
