import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientsReal, getPatientById, createPatient, updatePatient, deletePatient, type RealPatient } from "@/lib/services/api";

export interface PatientRow {
  id: string;
  _id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  email?: string;
  address: string;
  bloodGroup: string;
  registrationDate: string;
  status: "active" | "inactive" | "admitted";
  lastVisit?: string;
  department?: string;
  diagnosis?: string;
}

function toRow(p: RealPatient): PatientRow {
  return {
    id: p.patientId,
    _id: p._id,
    name: p.fullName,
    age: p.age ?? 0,
    gender: (p.gender === "female" ? "Female" : "Male") as "Male" | "Female",
    phone: p.mobile,
    email: p.email,
    address: p.address ?? "",
    bloodGroup: p.bloodGroup ?? "",
    registrationDate: p.createdAt?.split("T")[0] ?? "",
    status: p.status,
    lastVisit: p.updatedAt?.split("T")[0] ?? "",
    department: p.department,
    diagnosis: p.diagnosis,
  };
}

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await getPatientsReal();
      return res.data.map(toRow);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePatientById(id: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const res = await getPatientById(id);
      return toRow(res.data);
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RealPatient>) => createPatient(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RealPatient> }) =>
      updatePatient(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}
