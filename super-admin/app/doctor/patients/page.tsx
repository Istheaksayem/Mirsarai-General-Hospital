"use client";
import { useState } from "react";
import { Users, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useDoctorCompletedAppointments } from "@/lib/hooks/useCmsAppointments";
import { useRouter } from "next/navigation";

export default function DoctorPatientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: "10" };
  if (search) params.search = search;

  const { data, isLoading } = useDoctorCompletedAppointments(params);
  const appointments = data?.data || [];
  const total = data?.total || 0;

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "patientName", header: "Patient",
      cell: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p>
          <p className="text-xs text-gray-400">{r.patientAge as number}y · {r.patientGender as string} · {r.patientPhone as string}</p>
        </div>
      ),
    },
    {
      key: "date", header: "Date & Time",
      cell: (r) => {
        const d = r.date as string;
        const formatted = d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
        return <div><p className="font-medium">{formatted}</p><p className="text-xs text-gray-400">{r.time as string}</p></div>;
      },
    },
    { key: "type", header: "Type", cell: (r) => <Badge variant="info">{r.type as string}</Badge> },
    { key: "reason", header: "Reason / Notes", cell: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{(r.reason as string) || (r.notes as string) || "—"}</span> },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => {
        const id = row._id as string;
        return (
          <button
            onClick={() => router.push(`/doctor/appointments/${id}`)}
            title="View"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Patient History" description={`${total} completed appointments`} icon={Users} />
      <SearchFilter value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search patient..." className="max-w-sm" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={appointments as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No completed appointments"
        />
      </div>
    </div>
  );
}
