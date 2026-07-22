import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReportBatches,
  getReportBatchById,
  createReportBatch,
  updateReportBatch,
  deleteReportBatch,
  addReportFiles,
  deleteReportFile,
} from "@/lib/services/reportBatch";

export function useReportBatches(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["reportBatches", params],
    queryFn: () => getReportBatches(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useReportBatch(id: string) {
  return useQuery({
    queryKey: ["reportBatches", id],
    queryFn: () => getReportBatchById(id),
    enabled: !!id,
  });
}

export function useCreateReportBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createReportBatch(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportBatches"] });
    },
  });
}

export function useUpdateReportBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateReportBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportBatches"] });
    },
  });
}

export function useDeleteReportBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReportBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportBatches"] });
    },
  });
}

export function useAddReportFiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, formData }: { batchId: string; formData: FormData }) =>
      addReportFiles(batchId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportBatches"] });
    },
  });
}

export function useDeleteReportFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteReportFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportBatches"] });
    },
  });
}
