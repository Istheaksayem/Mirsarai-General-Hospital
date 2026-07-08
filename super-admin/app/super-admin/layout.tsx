import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="super-admin">{children}</DashboardLayout>;
}
