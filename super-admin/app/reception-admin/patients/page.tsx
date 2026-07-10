"use client";
import { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePatients } from "@/lib/hooks/usePatients";
import { createActionColumn } from "@/components/ui/ActionButtons";
import { RegisterPatientModal, type NewPatient } from "@/components/patients/RegisterPatientModal";
import type { Patient } from "@/lib/services/api";

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "id", header: "Patient ID",
    cell: (r) => <span className="font-mono text-xs font-bold text-[#1E2B7A] dark:text-blue-400">{r.id as string}</span>,
  },
  {
    key: "name", header: "Patient",
    cell: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#76BC21]/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#76BC21]">{(r.name as string).charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.name as string}</p>
          <p className="text-xs text-gray-400">{r.gender as string} · {r.bloodGroup as string}</p>
        </div>
      </div>
    ),
  },
  { key: "age", header: "Age", cell: (r) => `${r.age as number} yrs` },
  { key: "phone", header: "Phone" },
  { key: "department", header: "Department" },
  {
    key: "status", header: "Status",
    cell: (r) => <Badge variant={r.status === "active" ? "success" : r.status === "admitted" ? "info" : "warning"}>{r.status as string}</Badge>,
  },
  {
    key: "lastVisit", header: "Last Visit",
    cell: (r) => <span className="text-sm text-gray-400">{(r.lastVisit as string) || "—"}</span>,
  },
  createActionColumn(),
];

export default function ReceptionPatientsPage() {
  const { data: fetchedData = [], isLoading } = usePatients();
  const [localPatients, setLocalPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Merge fetched + locally registered patients
  const data = [...fetchedData, ...localPatients];

  const filtered = data.filter((p) => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    return ms && (!status || p.status === status);
  }) as unknown as Record<string, unknown>[];

  function handleRegister(patient: NewPatient) {
    setLocalPatients((prev) => [patient as unknown as Patient, ...prev]);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Patients" description={`${data.length} registered`} icon={Users}>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <UserPlus className="h-4 w-4 mr-1.5" />Register Patient
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or phone..." className="flex-1" />
        <SelectFilter value={status} onChange={setStatus}
          options={[
            { label: "Active", value: "active" },
            { label: "Admitted", value: "admitted" },
            { label: "Inactive", value: "inactive" },
          ]}
          placeholder="All Status" />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No patients found" />
      </div>

      {showModal && (
        <RegisterPatientModal
          onClose={() => setShowModal(false)}
          onRegister={handleRegister}
          existingCount={data.length}
        />
      )}
    </div>
  );
}
