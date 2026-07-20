import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorSchedule,
  upsertDoctorSchedule,
  addDoctorWeeklySlot,
  updateDoctorWeeklySlot,
  deleteDoctorWeeklySlot,
  addDoctorScheduleException,
  deleteDoctorScheduleException,
  getDoctorAvailableSlots,
  type DoctorScheduleData,
  type WeeklySlot,
  type ScheduleException,
  type AvailableSlot,
} from "@/lib/services/api";

const SCHEDULE_KEY = "doctor-schedule";

export const useDoctorSchedule = () =>
  useQuery({
    queryKey: [SCHEDULE_KEY],
    queryFn: () => getDoctorSchedule(),
    staleTime: 1000 * 30,
    retry: false,
  });

export const useAvailableSlots = (date: string | null) =>
  useQuery({
    queryKey: [SCHEDULE_KEY, "available-slots", date],
    queryFn: () => getDoctorAvailableSlots(date!),
    enabled: !!date,
    staleTime: 1000 * 30,
  });

export const useUpsertSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { weeklySlots?: WeeklySlot[]; exceptions?: ScheduleException[]; defaultSlotDuration?: number }) =>
      upsertDoctorSchedule(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCHEDULE_KEY] });
    },
  });
};

export const useAddWeeklySlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<WeeklySlot, "_id">) => addDoctorWeeklySlot(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCHEDULE_KEY] });
    },
  });
};

export const useUpdateWeeklySlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, data }: { slotId: string; data: Partial<WeeklySlot> }) =>
      updateDoctorWeeklySlot(slotId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCHEDULE_KEY] });
    },
  });
};

export const useDeleteWeeklySlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => deleteDoctorWeeklySlot(slotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCHEDULE_KEY] });
    },
  });
};

export const useAddException = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ScheduleException, "_id">) => addDoctorScheduleException(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCHEDULE_KEY] });
    },
  });
};

export const useDeleteException = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (exceptionId: string) => deleteDoctorScheduleException(exceptionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCHEDULE_KEY] });
    },
  });
};
