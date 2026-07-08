import { useQuery } from "@tanstack/react-query";
import { getWebsiteContent } from "@/lib/services/api";
export function useWebsiteContent() {
  return useQuery({ queryKey: ["website-content"], queryFn: getWebsiteContent, staleTime: 1000 * 60 * 10 });
}
