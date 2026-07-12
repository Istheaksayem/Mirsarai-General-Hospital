import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCmsAppointments,
  getCmsAppointmentById,
  createCmsAppointment,
  updateCmsAppointment,
  deleteCmsAppointment,
  updateCmsAppointmentStatus,
  type CmsAppointment,
} from "@/lib/services/api";

export function useCmsAppointments(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["cms-appointments", params],
    queryFn: () => getCmsAppointments(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCmsAppointmentById(id: string) {
  return useQuery({
    queryKey: ["cms-appointments", id],
    queryFn: () => getCmsAppointmentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateCmsAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsAppointment>) => createCmsAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-appointments"] });
    },
  });
}

export function useUpdateCmsAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CmsAppointment> }) =>
      updateCmsAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-appointments"] });
    },
  });
}

export function useDeleteCmsAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCmsAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-appointments"] });
    },
  });
}

export function useUpdateCmsAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCmsAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-appointments"] });
    },
  });
}
