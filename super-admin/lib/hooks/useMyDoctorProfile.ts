import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
  type DoctorProfileData,
} from "@/lib/services/api";

const PROFILE_KEY = "my-doctor-profile";

export const useMyDoctorProfile = () =>
  useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: () => getMyDoctorProfile(),
    staleTime: 1000 * 30,
    retry: false,
  });

export const useUpdateMyDoctorProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DoctorProfileData>) => updateMyDoctorProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
  });
};
