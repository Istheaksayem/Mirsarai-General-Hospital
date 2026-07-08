import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function LabAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="lab-admin">{children}</DashboardLayout>;
}
