import type { Metadata } from "next";
import { ComingSoonCard } from "@/components/dashboard/ComingSoonCard";

export const metadata: Metadata = { title: "Doctor Dashboard" };

export default function DoctorDashboard() {
  return (
    <ComingSoonCard
      title="Doctor Dashboard"
      description="Patient records, appointment schedule, and prescriptions coming in Step 2."
    />
  );
}
