import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyLabAdminProfile,
  updateMyLabAdminProfile,
  type LabAdminProfileData,
} from "@/lib/services/api";

const PROFILE_KEY = "my-lab-admin-profile";

export const useMyLabAdminProfile = () =>
  useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: () => getMyLabAdminProfile(),
    staleTime: 1000 * 30,
    retry: false,
  });

export const useUpdateMyLabAdminProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LabAdminProfileData>) => updateMyLabAdminProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
  });
};
