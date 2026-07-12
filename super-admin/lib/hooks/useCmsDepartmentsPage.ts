import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCmsDepartmentsPageConfig,
  updateCmsDepartmentsPageConfig,
  type CmsDepartmentsPage,
} from "@/lib/services/api";

const PAGE_KEY = "cms-departments-page";

export const useCmsDepartmentsPage = () =>
  useQuery({
    queryKey: [PAGE_KEY],
    queryFn: getCmsDepartmentsPageConfig,
    staleTime: 1000 * 60 * 5,
  });

export const useUpdateCmsDepartmentsPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CmsDepartmentsPage>) => updateCmsDepartmentsPageConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PAGE_KEY] });
    },
  });
};
