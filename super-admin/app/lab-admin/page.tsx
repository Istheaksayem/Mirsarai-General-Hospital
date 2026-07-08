import type { Metadata } from "next";
import { ComingSoonCard } from "@/components/dashboard/ComingSoonCard";

export const metadata: Metadata = { title: "Lab Dashboard" };

export default function LabAdminDashboard() {
  return (
    <ComingSoonCard
      title="Lab Admin Dashboard"
      description="Test order management, result tracking, and lab inventory coming in Step 2."
    />
  );
}
