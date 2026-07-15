import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyReceptionistProfile,
  updateMyReceptionistProfile,
  type ReceptionistProfileData,
} from "@/lib/services/api";

const PROFILE_KEY = "my-receptionist-profile";

export const useMyReceptionistProfile = () =>
  useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: () => getMyReceptionistProfile(),
    staleTime: 1000 * 30,
    retry: false,
  });

export const useUpdateMyReceptionistProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ReceptionistProfileData>) => updateMyReceptionistProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
  });
};
