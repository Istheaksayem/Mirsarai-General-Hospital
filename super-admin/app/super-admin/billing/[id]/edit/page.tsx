"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";
import { useBilling } from "@/lib/hooks/useBilling";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useBilling();
  const inv = data.find(i => i.id === decodeURIComponent(id));

  const [form, setForm] = useState({ patientName: "", date: "", dueDate: "", discount: "0", tax: "0", paymentMethod: "", status: "unpaid", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (inv) setForm({ patientName: inv.patientName, date: inv.date, dueDate: inv.dueDate, discount: String(inv.discount), tax: String(inv.tax), paymentMethod: inv.paymentMethod || "", status: inv.status, notes: inv.notes || "" });
  }, [inv]);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push(`/super-admin/billing/${encodeURIComponent(id)}`);
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!inv) return <div className="p-16 text-center text-gray-400">Invoice not found</div>;

  return (
    <FormPage title="Edit Invoice" description={`Editing: ${inv.id}`} backHref={`/super-admin/billing/${encodeURIComponent(id)}`} onSubmit={handleSubmit} submitLabel="Save Changes">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase">Invoice ID</p>
        <p className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{inv.id}</p>
      </div>
      <FormSection title="Invoice Details">
        <FormField label="Patient Name" required error={errors.patientName}><FormInput value={form.patientName} onChange={e => set("patientName", e.target.value)} /></FormField>
        <FormField label="Invoice Date"><FormInput type="date" value={form.date} onChange={e => set("date", e.target.value)} /></FormField>
        <FormField label="Due Date" required error={errors.dueDate}><FormInput type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </FormSelect>
        </FormField>
        <FormField label="Payment Method">
          <FormSelect value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
            <option value="">None</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Mobile Banking">Mobile Banking</option>
          </FormSelect>
        </FormField>
        <FormField label="Discount (৳)"><FormInput type="number" min="0" value={form.discount} onChange={e => set("discount", e.target.value)} /></FormField>
        <FormField label="Tax (৳)"><FormInput type="number" min="0" value={form.tax} onChange={e => set("tax", e.target.value)} /></FormField>
        <div className="sm:col-span-2">
          <FormField label="Notes"><FormInput value={form.notes} onChange={e => set("notes", e.target.value)} /></FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
