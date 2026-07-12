import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCmsDepartments,
  getCmsDepartmentById,
  createCmsDepartment,
  updateCmsDepartment,
  patchCmsDepartment,
  deleteCmsDepartment,
  toggleCmsDeptVisibility,
  reorderCmsDepartments,
  type CmsDepartment,
} from "@/lib/services/api";

const DEPTS_KEY = "cms-departments";

// ── Query Hooks ───────────────────────────────────────────────────────────────

export const useCmsDepartments = (params: { page?: number; limit?: number; search?: string } = {}) =>
  useQuery({
    queryKey: [DEPTS_KEY, params],
    queryFn: () => getCmsDepartments(params),
    staleTime: 1000 * 30,
  });

export const useCmsDepartmentById = (id: string) =>
  useQuery({
    queryKey: [DEPTS_KEY, id],
    queryFn: () => getCmsDepartmentById(id),
    enabled: !!id && id !== "new",
    staleTime: 1000 * 30,
  });

// ── Mutation Hooks ────────────────────────────────────────────────────────────

export const useCreateCmsDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDepartment>) => createCmsDepartment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEPTS_KEY] }),
  });
};

export const useUpdateCmsDepartment = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDepartment>) => updateCmsDepartment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DEPTS_KEY] });
      qc.invalidateQueries({ queryKey: [DEPTS_KEY, id] });
    },
  });
};

export const usePatchCmsDepartment = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDepartment>) => patchCmsDepartment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DEPTS_KEY] });
      qc.invalidateQueries({ queryKey: [DEPTS_KEY, id] });
    },
  });
};

export const useDeleteCmsDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCmsDepartment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEPTS_KEY] }),
  });
};

export const useToggleCmsDeptVisibility = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleCmsDeptVisibility(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEPTS_KEY] }),
  });
};

export const useReorderCmsDepartments = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; displayOrder: number }[]) =>
      reorderCmsDepartments(updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEPTS_KEY] }),
  });
};
