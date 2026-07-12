import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface AppointmentFormData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  doctor: string;
  department?: string;
  service?: string;
  date: string;
  time: string;
  reason?: string;
}

const submitAppointment = async (data: AppointmentFormData) => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to book appointment" }));
    throw new Error(err.message || "Failed to book appointment");
  }
  const json = await res.json();
  return json.data;
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
