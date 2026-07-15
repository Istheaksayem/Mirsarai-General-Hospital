import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCmsDoctors,
  getCmsDoctorById,
  createCmsDoctor,
  updateCmsDoctor,
  patchCmsDoctor,
  deleteCmsDoctor,
  toggleCmsDoctorVisibility,
  toggleCmsDoctorFeatured,
  reorderCmsDoctors,
  getPendingDoctorRegistrations,
  approveDoctorRegistration,
  rejectDoctorRegistration,
  assignDoctorAdminInfo,
  type CmsDoctor,
  type DoctorQueryParams,
  type PendingRegistration,
  type AdminInfoData,
} from "@/lib/services/api";

const DOCTORS_KEY = "cms-doctors";
const PENDING_KEY = "pending-registrations";

// ── Query Hooks ───────────────────────────────────────────────────────────────

export const useCmsDoctors = (params: DoctorQueryParams = {}) =>
  useQuery({
    queryKey: [DOCTORS_KEY, params],
    queryFn: () => getCmsDoctors(params),
    staleTime: 1000 * 30,
  });

export const useCmsDoctorById = (id: string) =>
  useQuery({
    queryKey: [DOCTORS_KEY, id],
    queryFn: () => getCmsDoctorById(id),
    enabled: !!id && id !== "new",
    staleTime: 1000 * 30,
  });

// ── Mutation Hooks ────────────────────────────────────────────────────────────

export const useCreateCmsDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDoctor>) => createCmsDoctor(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
};

export const useUpdateCmsDoctor = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDoctor>) => updateCmsDoctor(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DOCTORS_KEY] });
      qc.invalidateQueries({ queryKey: [DOCTORS_KEY, id] });
    },
  });
};

export const usePatchCmsDoctor = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDoctor>) => patchCmsDoctor(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DOCTORS_KEY] });
      qc.invalidateQueries({ queryKey: [DOCTORS_KEY, id] });
    },
  });
};

export const useDeleteCmsDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCmsDoctor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
};

export const useToggleCmsDoctorVisibility = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleCmsDoctorVisibility(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
};

export const useToggleCmsDoctorFeatured = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleCmsDoctorFeatured(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
};

export const useReorderCmsDoctors = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; displayOrder: number }[]) =>
      reorderCmsDoctors(updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DOCTORS_KEY] }),
  });
};

// ── Pending Registration Hooks ─────────────────────────────────────────────────

export const usePendingRegistrations = () =>
  useQuery({
    queryKey: [PENDING_KEY],
    queryFn: () => getPendingDoctorRegistrations(),
    staleTime: 1000 * 15,
  });

export const useApproveRegistration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => approveDoctorRegistration(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PENDING_KEY] }),
  });
};

export const useRejectRegistration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => rejectDoctorRegistration(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PENDING_KEY] }),
  });
};

export const useAssignAdminInfo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AdminInfoData }) =>
      assignDoctorAdminInfo(userId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PENDING_KEY] }),
  });
};
