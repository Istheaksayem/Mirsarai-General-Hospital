"use client";
import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useBilling } from "@/lib/hooks/useBilling";
import { formatCurrency } from "@/lib/date-utils";
import { type Invoice } from "@/lib/services/api";

const sv: Record<Invoice["status"], "success" | "warning" | "danger"> = { paid: "success", partial: "warning", unpaid: "danger" };
const columns: Column<Record<string, unknown>>[] = [
  { key: "id", header: "Invoice", cell: (r) => <span className="font-mono text-xs font-semibold text-[#1E2B7A] dark:text-blue-400">{r.id as string}</span> },
  { key: "patientName", header: "Patient", cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p><p className="text-xs text-gray-400">{r.date as string}</p></div> },
  { key: "total", header: "Total", cell: (r) => <span className="font-semibold">{formatCurrency(r.total as number)}</span> },
  { key: "paid", header: "Paid", cell: (r) => <span className="text-green-600 dark:text-green-400">{formatCurrency(r.paid as number)}</span> },
  { key: "due", header: "Due", cell: (r) => <span className={(r.due as number) > 0 ? "text-red-500 dark:text-red-400 font-medium" : "text-gray-400"}>{formatCurrency(r.due as number)}</span> },
  { key: "status", header: "Status", cell: (r) => <Badge variant={sv[r.status as Invoice["status"]]}>{r.status as string}</Badge> },
];

export default function ReceptionBillingPage() {
  const { data = [], isLoading } = useBilling();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const filtered = data.filter((i) => {
    const ms = !search || i.patientName.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
    return ms && (!status || i.status === status);
  }) as unknown as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description={`${data.length} invoices`} icon={CreditCard}>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Invoice</Button>
      </PageHeader>
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or invoice..." className="flex-1" />
        <SelectFilter value={status} onChange={setStatus}
          options={[{ label: "Paid", value: "paid" }, { label: "Partial", value: "partial" }, { label: "Unpaid", value: "unpaid" }]}
          placeholder="All Status" />
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No invoices found" />
      </div>
    </div>
  );
}
