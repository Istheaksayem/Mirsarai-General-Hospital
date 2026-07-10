"use client";

import { useState } from "react";
import { X, User, Phone, Calendar, MapPin, Building2, UserCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface NewPatient {
  id: string;
  name: string;
  phone: string;
  dob: string;
  age: number;
  gender: string;
  address: string;
  department: string;
  bloodGroup: string;
  lastVisit: string;
  registrationDate: string;
  status: "active";
}

// ── Patient ID generator ──────────────────────────────────────────────────────
export function generatePatientId(existingCount: number): string {
  const year = new Date().getFullYear();
  const seq = String(existingCount + 1).padStart(6, "0");
  return `MGH-${year}-${seq}`;
}

// ── Age from DOB ──────────────────────────────────────────────────────────────
function calcAge(dob: string): number {
  if (!dob) return 0;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ── Departments list ──────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "General Medicine", "Cardiology", "Orthopedics", "Neurology",
  "Gynecology", "Pediatrics", "Gastroenterology", "Dermatology",
  "ENT", "Ophthalmology", "Urology", "Oncology",
  "Radiology", "Pathology", "Emergency",
];

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label, required, icon: Icon, children, error,
}: {
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all",
        className
      )}
      {...props}
    />
  );
}

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all appearance-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
interface RegisterPatientModalProps {
  onClose: () => void;
  onRegister: (patient: NewPatient) => void;
  existingCount: number;
}

export function RegisterPatientModal({ onClose, onRegister, existingCount }: RegisterPatientModalProps) {
  const generatedId = generatePatientId(existingCount);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    department: "",
    bloodGroup: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const age = calcAge(form.dob);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Mobile number is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[-\s]/g, "")))
      e.phone = "Enter a valid BD mobile number";
    if (!form.dob) e.dob = "Date of birth is required";
    else if (age < 0 || age > 150) e.dob = "Invalid date of birth";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.department) e.department = "Department is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const patient: NewPatient = {
      id: generatedId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      dob: form.dob,
      age,
      gender: form.gender,
      address: form.address.trim(),
      department: form.department,
      bloodGroup: form.bloodGroup,
      lastVisit: today,
      registrationDate: today,
      status: "active",
    };

    setSubmitted(true);
    setTimeout(() => {
      onRegister(patient);
      onClose();
    }, 1200);
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-12 flex flex-col items-center gap-4 shadow-2xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76BC21]/15">
            <CheckCircle2 className="h-10 w-10 text-[#76BC21]" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Patient Registered!</p>
            <p className="text-sm text-gray-500 mt-1">Patient ID: <span className="font-mono font-bold text-[#1E2B7A] dark:text-blue-400">{generatedId}</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-[#1E2B7A]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E2B7A]">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Register New Patient</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the required fields to create profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Auto-generated ID banner */}
        <div className="mx-6 mt-5 flex items-center justify-between rounded-2xl border border-[#1E2B7A]/20 bg-[#1E2B7A]/5 dark:bg-[#1E2B7A]/10 px-5 py-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Auto-Generated Patient ID
            </p>
            <p className="font-mono text-xl font-black text-[#1E2B7A] dark:text-blue-400 tracking-wider mt-0.5">
              {generatedId}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#1E2B7A]/10 flex items-center justify-center">
            <User className="h-5 w-5 text-[#1E2B7A] dark:text-blue-400" />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Row 1: Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required icon={User} error={errors.name}>
              <Input
                placeholder="e.g. Aminul Islam"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field label="Mobile Number" required icon={Phone} error={errors.phone}>
              <Input
                placeholder="e.g. 01711-234567"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                maxLength={14}
              />
            </Field>
          </div>

          {/* Row 2: DOB + Age (auto) + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Date of Birth" required icon={Calendar} error={errors.dob}>
              <Input
                type="date"
                max={today}
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </Field>
            <Field label="Age (auto)">
              <Input
                value={form.dob ? `${age} years` : "—"}
                readOnly
                className="bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
              />
            </Field>
            <Field label="Gender" required error={errors.gender}>
              <Select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </Field>
          </div>

          {/* Row 3: Department + Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Department" required icon={Building2} error={errors.department}>
              <Select value={form.department} onChange={(e) => set("department", e.target.value)}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </Field>
            <Field label="Blood Group">
              <Select value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
                <option value="">Select (optional)</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Row 4: Address (auto hint) */}
          <Field label="Address" required icon={MapPin} error={errors.address}>
            <Input
              placeholder="e.g. Mirsarai, Chittagong"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>

          {/* Last Visit — system generated note */}
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Last Visit & Registration Date</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{today} — auto-set to today</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#1E2B7A] hover:bg-[#76BC21] text-white text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Register Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
