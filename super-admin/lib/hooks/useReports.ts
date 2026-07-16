import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLabReports, updateLabReportStatus, deleteLabReport, downloadLabReport } from "@/lib/services/api";

export function useReports() {
  return useQuery({ 
    queryKey: ["lab-reports"], 
    queryFn: async () => {
      const response = await getLabReports();
      return response.data || [];
    }, 
    staleTime: 1000 * 60 * 5 
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "completed" }) =>
      updateLabReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-reports"] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteLabReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-reports"] });
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: (id: string) => downloadLabReport(id),
  });
}
