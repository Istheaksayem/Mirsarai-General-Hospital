import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboard,
  fetchPatients,
  fetchDoctors,
  fetchAppointments,
  fetchDepartments,
  fetchReports,
  fetchNotifications,
  fetchRoles,
  fetchActivities,
  fetchWebsiteContent,
} from "../services/api";

export const useDashboard = (role: string) => {
  return useQuery<Record<string, unknown>>({
    queryKey: ["dashboard", role],
    queryFn: () => fetchDashboard(role),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePatients = () => {
  return useQuery<unknown[]>({
    queryKey: ["patients"],
    queryFn: () => fetchPatients() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 10,
  });
};

export const useDoctors = () => {
  return useQuery<unknown[]>({
    queryKey: ["doctors"],
    queryFn: () => fetchDoctors() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAppointments = () => {
  return useQuery<unknown[]>({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDepartments = () => {
  return useQuery<unknown[]>({
    queryKey: ["departments"],
    queryFn: () => fetchDepartments() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 15,
  });
};

export const useReports = () => {
  return useQuery<unknown[]>({
    queryKey: ["reports"],
    queryFn: () => fetchReports() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 5,
  });
};

export const useNotifications = () => {
  return useQuery<unknown[]>({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 2,
  });
};

export const useRoles = () => {
  return useQuery<unknown[]>({
    queryKey: ["roles"],
    queryFn: () => fetchRoles() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 20,
  });
};

export const useActivities = () => {
  return useQuery<unknown[]>({
    queryKey: ["activities"],
    queryFn: () => fetchActivities() as Promise<unknown[]>,
    staleTime: 1000 * 60 * 2,
  });
};

export const useWebsiteContent = () => {
  return useQuery<unknown>({
    queryKey: ["websiteContent"],
    queryFn: fetchWebsiteContent,
    staleTime: 1000 * 60 * 30,
  });
};
