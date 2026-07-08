import type { Metadata } from "next";
import { ComingSoonCard } from "@/components/dashboard/ComingSoonCard";

export const metadata: Metadata = { title: "Reception Dashboard" };

export default function ReceptionAdminDashboard() {
  return (
    <ComingSoonCard
      title="Reception Dashboard"
      description="Appointment management, patient check-in, and queue system coming in Step 2."
    />
  );
}
