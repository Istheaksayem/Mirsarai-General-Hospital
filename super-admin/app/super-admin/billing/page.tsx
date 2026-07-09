"use client";

import { useState } from "react";
import { CreditCard, Plus, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useBilling } from "@/lib/hooks/useBilling";
import { formatCurrency } from "@/lib/date-utils";
import { type Invoice } from "@/lib/services/api";

const statusVariant: Record<Invoice["status"], "success" | "warning" | "danger"> = {
  paid: "success", partial: "warning", unpaid: "danger",
};

const columns: Column<Record<string, unknown>>[] = [
  { key: "id", header: "Invoice", cell: (r) => <span className="font-mono text-xs font-semibold text-[#1E2B7A] dark:text-blue-400">{r.id as string}</span> },
  {
    key: "patientName", header: "Patient",
    cell: (r) => <div><p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p><p className="text-xs text-gray-400">{r.date as string}</p></div>,
  },
  { key: "total", header: "Total", cell: (r) => <span className="font-semibold">{formatCurrency(r.total as number)}</span> },
  { key: "paid", header: "Paid", cell: (r) => <span className="text-green-600 dark:text-green-400">{formatCurrency(r.paid as number)}</span> },
  { key: "due", header: "Due", cell: (r) => <span className={(r.due as number) > 0 ? "text-red-500 dark:text-red-400 font-medium" : "text-gray-400"}>{formatCurrency(r.due as number)}</span> },
  { key: "status", header: "Status", cell: (r) => <Badge variant={statusVariant[r.status as Invoice["status"]]}>{r.status as string}</Badge> },
  {
    key: "dueDate", header: "Due Date",
    cell: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{r.dueDate as string}</span>,
  },
];

export default function BillingPage() {
  const { data = [], isLoading } = useBilling();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = data.filter((inv) => {
    const ms = !search || inv.patientName.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const mst = !statusFilter || inv.status === statusFilter;
    return ms && mst;
  }) as unknown as Record<string, unknown>[];

  const totalRevenue = data.filter(i => i.status === "paid").reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = data.reduce((s, i) => s + i.due, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Invoices" description={`${data.length} invoices`} icon={CreditCard}>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Export</Button>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New Invoice</Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "text-green-600 dark:text-green-400" },
          { label: "Outstanding", value: formatCurrency(totalOutstanding), color: "text-red-500 dark:text-red-400" },
          { label: "Paid Invoices", value: data.filter(i => i.status === "paid").length, color: "text-[#1E2B7A] dark:text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient or invoice ID..." className="flex-1" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter}
          options={[{ label: "Paid", value: "paid" }, { label: "Partial", value: "partial" }, { label: "Unpaid", value: "unpaid" }]}
          placeholder="All Status" />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No invoices found" />
      </div>
    </div>
  );
}
