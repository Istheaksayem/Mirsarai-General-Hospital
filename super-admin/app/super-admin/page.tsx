import type { Metadata } from "next";
import { ComingSoonCard } from "@/components/dashboard/ComingSoonCard";

export const metadata: Metadata = { title: "Super Admin Dashboard" };

export default function SuperAdminDashboard() {
  return (
    <ComingSoonCard
      title="Super Admin Dashboard"
      description="Full dashboard widgets, analytics, and management tools will be built in Step 2."
    />
  );
}
