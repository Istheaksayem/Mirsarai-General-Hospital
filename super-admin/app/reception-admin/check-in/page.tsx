"use client";
import { useState } from "react";
import { UserCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePatients } from "@/lib/hooks/usePatients";

export default function CheckInPage() {
  const { data = [], isLoading } = usePatients();
  const [search, setSearch] = useState("");
  const filtered = data.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Check-In" description="Search and check in patients for their appointments" icon={UserCheck} />
      <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, ID or phone..." className="max-w-lg" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse bg-gray-100 dark:bg-gray-800 m-2 rounded-xl" />
        )) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500">
            {search ? "No patients match your search" : "Start typing to search patients"}
          </div>
        ) : filtered.map((patient) => (
          <div key={patient.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
            <div className="h-9 w-9 shrink-0 rounded-full bg-[#76BC21]/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-[#76BC21]">{patient.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</p>
              <p className="text-xs text-gray-400">{patient.id} · {patient.phone} · {patient.bloodGroup}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={patient.status === "active" ? "success" : patient.status === "admitted" ? "info" : "warning"}>{patient.status}</Badge>
              <Button size="sm" variant="outline">Check In</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
