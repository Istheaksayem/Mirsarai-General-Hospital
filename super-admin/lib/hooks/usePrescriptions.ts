"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorPrescriptions,
  getDoctorPrescriptionById,
  createPrescription,
  deletePrescription,
  lookupPrescriptionPatient,
  type Prescription,
  type LookupPatientResult,
} from "@/lib/services/api";
import toast from "react-hot-toast";

export function usePrescriptions(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["doctor-prescriptions", params],
    queryFn: () => getDoctorPrescriptions(params),
    staleTime: 1000 * 30,
  });
}

export function usePrescriptionById(id: string) {
  return useQuery({
    queryKey: ["doctor-prescription", id],
    queryFn: () => getDoctorPrescriptionById(id),
    enabled: !!id,
  });
}

export function useCreatePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createPrescription(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-prescriptions"] });
      toast.success("Prescription created successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useDeletePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrescription(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-prescriptions"] });
      toast.success("Prescription archived");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useLookupPatient() {
  return useMutation({
    mutationFn: (query: string) => lookupPrescriptionPatient(query),
  });
}
