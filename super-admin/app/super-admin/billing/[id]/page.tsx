"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, User, CreditCard, Calendar, DollarSign, FileText } from "lucide-react";
import { useBilling } from "@/lib/hooks/useBilling";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/date-utils";
import { type Invoice } from "@/lib/services/api";

const statusVariant: Record<Invoice["status"], "success" | "warning" | "danger"> = { paid: "success", partial: "warning", unpaid: "danger" };

export default function ViewInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useBilling();
  const inv = data.find(i => i.id === decodeURIComponent(id));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!inv) return <div className="p-16 text-center text-gray-400">Invoice not found</div>;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/super-admin/billing")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Invoice Details</h1><p className="text-sm text-gray-500 mt-0.5">View invoice information</p></div>
        </div>
        <button onClick={() => router.push(`/super-admin/billing/${encodeURIComponent(inv.id)}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-semibold transition-all">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-lg font-black text-[#1E2B7A] dark:text-blue-400">{inv.id}</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{inv.patientName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Date: {inv.date} · Due: {inv.dueDate}</p>
          </div>
          <Badge variant={statusVariant[inv.status]}>{inv.status}</Badge>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {[
            { label: "Total", value: formatCurrency(inv.total), color: "text-gray-900 dark:text-gray-100" },
            { label: "Paid", value: formatCurrency(inv.paid), color: "text-green-600 dark:text-green-400" },
            { label: "Due", value: formatCurrency(inv.due), color: inv.due > 0 ? "text-red-500" : "text-gray-400" },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services table */}
      {inv.services?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Services</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {inv.services.map((svc, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{svc.name}</p>
                  <p className="text-xs text-gray-400">Qty: {svc.quantity} × {formatCurrency(svc.rate)}</p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(svc.total)}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(inv.subtotal)}</span></div>
            {inv.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-green-600">−{formatCurrency(inv.discount)}</span></div>}
            {inv.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>{formatCurrency(inv.tax)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t border-gray-100 dark:border-gray-800 pt-2"><span>Total</span><span className="text-[#1E2B7A] dark:text-blue-400">{formatCurrency(inv.total)}</span></div>
          </div>
        </div>
      )}

      {inv.notes && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Notes</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{inv.notes}</p>
        </div>
      )}
    </div>
  );
}
