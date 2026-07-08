// Reusable API functions for fetching mock data

export async function fetchDashboard(role: string) {
  // Map roles to their JSON filenames
  let filename = "super-admin.json";
  if (role === "reception-admin" || role === "reception") {
    filename = "reception-admin.json";
  } else if (role === "lab-admin" || role === "lab") {
    filename = "lab-admin.json";
  } else if (role === "doctor") {
    filename = "doctor.json";
  }

  const res = await fetch(`/mock-data/dashboard/${filename}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard data for role: ${role}`);
  }
  return res.json();
}

export async function fetchPatients() {
  const res = await fetch("/mock-data/patients.json");
  if (!res.ok) throw new Error("Failed to fetch patients list");
  return res.json();
}

export async function fetchDoctors() {
  const res = await fetch("/mock-data/doctors.json");
  if (!res.ok) throw new Error("Failed to fetch doctors list");
  return res.json();
}

export async function fetchAppointments() {
  const res = await fetch("/mock-data/appointments.json");
  if (!res.ok) throw new Error("Failed to fetch appointments list");
  return res.json();
}

export async function fetchDepartments() {
  const res = await fetch("/mock-data/departments.json");
  if (!res.ok) throw new Error("Failed to fetch departments list");
  return res.json();
}

export async function fetchReports() {
  const res = await fetch("/mock-data/reports.json");
  if (!res.ok) throw new Error("Failed to fetch reports list");
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch("/mock-data/notifications.json");
  if (!res.ok) throw new Error("Failed to fetch notifications list");
  return res.json();
}

export async function fetchRoles() {
  const res = await fetch("/mock-data/roles.json");
  if (!res.ok) throw new Error("Failed to fetch roles list");
  return res.json();
}

export async function fetchActivities() {
  const res = await fetch("/mock-data/activities.json");
  if (!res.ok) throw new Error("Failed to fetch activities audit log");
  return res.json();
}

export async function fetchWebsiteContent() {
  const res = await fetch("/mock-data/website-content.json");
  if (!res.ok) throw new Error("Failed to fetch website CMS content");
  return res.json();
}
