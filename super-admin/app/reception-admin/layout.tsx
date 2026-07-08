import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ReceptionAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="reception-admin">{children}</DashboardLayout>;
}
