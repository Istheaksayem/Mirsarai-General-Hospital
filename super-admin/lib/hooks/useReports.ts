import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUnifiedReports, updateUnifiedReportStatus,
  deleteUnifiedReport, getReportStats,
} from '@/lib/services/api';

export function useReports(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      const response = await getUnifiedReports(params);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useReportStats() {
  return useQuery({
    queryKey: ['reports', 'stats'],
    queryFn: async () => {
      const res = await getReportStats();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateUnifiedReportStatus(id, status as 'pending' | 'in-progress' | 'completed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUnifiedReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
