"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormPage, FormField, FormInput, FormSelect, FormSection } from "@/components/ui/FormPage";

export default function AddInvoicePage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ patientName: "", patientId: "", date: today, dueDate: "", serviceName: "", serviceAmount: "", discount: "0", tax: "0", paymentMethod: "", status: "unpaid", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.serviceName.trim()) e.serviceName = "Service is required";
    if (!form.serviceAmount) e.serviceAmount = "Amount is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    router.push("/super-admin/billing");
  }

  return (
    <FormPage title="New Invoice" description="Create a new billing invoice" backHref="/super-admin/billing" onSubmit={handleSubmit} submitLabel="Create Invoice">
      <FormSection title="Patient & Dates">
        <FormField label="Patient Name" required error={errors.patientName}><FormInput placeholder="Full patient name" value={form.patientName} onChange={e => set("patientName", e.target.value)} /></FormField>
        <FormField label="Patient ID"><FormInput placeholder="e.g. P-1001" value={form.patientId} onChange={e => set("patientId", e.target.value)} /></FormField>
        <FormField label="Invoice Date"><FormInput type="date" value={form.date} onChange={e => set("date", e.target.value)} /></FormField>
        <FormField label="Due Date" required error={errors.dueDate}><FormInput type="date" min={today} value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></FormField>
      </FormSection>
      <FormSection title="Services & Amount">
        <FormField label="Service Name" required error={errors.serviceName}><FormInput placeholder="e.g. Consultation, Lab Test" value={form.serviceName} onChange={e => set("serviceName", e.target.value)} /></FormField>
        <FormField label="Amount (৳)" required error={errors.serviceAmount}><FormInput type="number" min="0" placeholder="0.00" value={form.serviceAmount} onChange={e => set("serviceAmount", e.target.value)} /></FormField>
        <FormField label="Discount (৳)"><FormInput type="number" min="0" value={form.discount} onChange={e => set("discount", e.target.value)} /></FormField>
        <FormField label="Tax (৳)"><FormInput type="number" min="0" value={form.tax} onChange={e => set("tax", e.target.value)} /></FormField>
        <FormField label="Payment Method">
          <FormSelect value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
            <option value="">Select (optional)</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Mobile Banking">Mobile Banking</option>
          </FormSelect>
        </FormField>
        <FormField label="Status">
          <FormSelect value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </FormSelect>
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Notes"><FormInput placeholder="Additional notes" value={form.notes} onChange={e => set("notes", e.target.value)} /></FormField>
        </div>
      </FormSection>
    </FormPage>
  );
}
