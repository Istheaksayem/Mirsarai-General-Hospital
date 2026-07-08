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
  return useQuery({
    queryKey: ["dashboard", role],
    queryFn: () => fetchDashboard(role),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime: 1000 * 60 * 15,
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
    staleTime: 1000 * 60 * 5,
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 2,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 20,
  });
};

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 2,
  });
};

export const useWebsiteContent = () => {
  return useQuery({
    queryKey: ["websiteContent"],
    queryFn: fetchWebsiteContent,
    staleTime: 1000 * 60 * 30,
  });
};
