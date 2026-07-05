"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaNotesMedical,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

const doctors = [
  { name: "Dr. Sarah Jenkins", specialty: "Cardiology", slots: ["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM"] },
  { name: "Dr. Michael Chen", specialty: "Orthopedics", slots: ["08:30 AM", "11:00 AM", "01:30 PM", "03:30 PM"] },
  { name: "Dr. Emily Roberts", specialty: "Pediatrics", slots: ["09:30 AM", "10:30 AM", "02:30 PM", "05:00 PM"] },
  { name: "Dr. James Wilson", specialty: "General Surgery", slots: ["08:00 AM", "11:30 AM", "01:00 PM", "04:30 PM"] },
  { name: "Dr. Aisha Rahman", specialty: "Gynecology", slots: ["09:00 AM", "10:00 AM", "03:00 PM", "04:00 PM"] },
  { name: "Dr. Robert Khan", specialty: "Neurology", slots: ["10:00 AM", "12:00 PM", "02:00 PM", "05:00 PM"] },
];

const departments = [
  "Cardiology", "Orthopedics", "Pediatrics", "General Surgery",
  "Gynecology", "Neurology", "Dermatology", "ENT", "Ophthalmology",
];

const steps = ["Personal Info", "Select Doctor", "Schedule", "Confirm"];

const stepVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.25 } }),
};

export default function AppointmentForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const selectedDoctor = doctors.find((d) => d.name === form.doctor);

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required.";
      if (!form.phone.trim()) errs.phone = "Phone number is required.";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
      if (!form.gender) errs.gender = "Please select gender.";
    }
    if (step === 1) {
      if (!form.department) errs.department = "Please select a department.";
      if (!form.doctor) errs.doctor = "Please select a doctor.";
    }
    if (step === 2) {
      if (!form.date) errs.date = "Please select a date.";
      if (!form.time) errs.time = "Please select a time slot.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDir(1);
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Min date: today
  const today = new Date().toISOString().split("T")[0];

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Appointment Booked!</h2>
        <p className="text-gray-500 max-w-md mb-2">
          Thank you, <strong>{form.fullName}</strong>. Your appointment with{" "}
          <strong>{form.doctor}</strong> has been confirmed.
        </p>
        <p className="text-gray-500 mb-8">
          📅 <strong>{form.date}</strong> at <strong>{form.time}</strong>
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 text-sm text-blue-700 max-w-sm">
          A confirmation will be sent to your phone{form.email ? " and email" : ""}. Please arrive 10 minutes early.
        </div>
        <button
          onClick={() => { setSubmitted(false); setStep(0); setForm({ fullName: "", phone: "", email: "", age: "", gender: "", department: "", doctor: "", date: "", time: "", message: "" }); }}
          className="mt-8 text-primary underline underline-offset-4 text-sm hover:opacity-75 transition"
        >
          Book another appointment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  i < step
                    ? "bg-secondary text-white shadow-md"
                    : i === step
                    ? "bg-primary text-white shadow-lg ring-4 ring-primary/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-primary" : i < step ? "text-secondary" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${i < step ? "bg-secondary" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="overflow-hidden min-h-[320px]">
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div key="step0" custom={dir} variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaUser className="text-primary" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name *" error={errors.fullName}>
                  <InputIcon icon={<FaUser />}>
                    <input id="fullName" type="text" placeholder="John Doe" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputCls(errors.fullName)} />
                  </InputIcon>
                </Field>
                <Field label="Phone Number *" error={errors.phone}>
                  <InputIcon icon={<FaPhone />}>
                    <input id="phone" type="tel" placeholder="+880 1XXXXXXXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls(errors.phone)} />
                  </InputIcon>
                </Field>
                <Field label="Email Address" error={errors.email}>
                  <InputIcon icon={<FaEnvelope />}>
                    <input id="email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls(errors.email)} />
                  </InputIcon>
                </Field>
                <Field label="Age" error={errors.age}>
                  <input id="age" type="number" min="1" max="120" placeholder="e.g. 32" value={form.age} onChange={(e) => update("age", e.target.value)} className={`${inputCls(errors.age)} pl-4`} />
                </Field>
                <Field label="Gender *" error={errors.gender} className="sm:col-span-2">
                  <div className="flex gap-3 flex-wrap">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => update("gender", g)}
                        className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
                          form.gender === g
                            ? "bg-primary text-white border-primary shadow-md"
                            : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-500 text-xs mt-1.5">{errors.gender}</p>}
                </Field>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaUserMd className="text-primary" /> Select Doctor & Department
              </h3>
              <Field label="Department *" error={errors.department}>
                <select id="department" value={form.department} onChange={(e) => { update("department", e.target.value); update("doctor", ""); }} className={`${inputCls(errors.department)} pl-4`}>
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Choose a Doctor *</p>
                {errors.doctor && <p className="text-red-500 text-xs mb-2">{errors.doctor}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors
                    .filter((d) => !form.department || d.specialty === form.department)
                    .map((d) => (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => update("doctor", d.name)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.doctor === d.name
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-gray-100 hover:border-primary/40 bg-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shrink-0">
                        <FaUserMd className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{d.name}</p>
                        <p className="text-xs text-secondary font-medium">{d.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {doctors.filter((d) => !form.department || d.specialty === form.department).length === 0 && (
                  <p className="text-gray-400 text-sm mt-4 text-center">No doctors found for selected department.</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-primary" /> Schedule Appointment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Preferred Date *" error={errors.date}>
                  <InputIcon icon={<FaCalendarAlt />}>
                    <input id="date" type="date" min={today} value={form.date} onChange={(e) => { update("date", e.target.value); update("time", ""); }} className={inputCls(errors.date)} />
                  </InputIcon>
                </Field>
                <div />
              </div>
              {form.date && selectedDoctor && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaClock className="text-primary" /> Available Time Slots
                  </p>
                  {errors.time && <p className="text-red-500 text-xs mb-2">{errors.time}</p>}
                  <div className="flex flex-wrap gap-3">
                    {selectedDoctor.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => update("time", slot)}
                        className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
                          form.time === slot
                            ? "bg-primary text-white border-primary shadow-md"
                            : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {!form.date && (
                <p className="text-gray-400 text-sm mt-4">Please select a date to see available slots.</p>
              )}
              <div className="mt-6">
                <Field label="Additional Notes" error="">
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Describe your symptoms or reason for visit (optional)..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition"
                  />
                </Field>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaNotesMedical className="text-primary" /> Confirm Your Appointment
              </h3>
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/20 rounded-2xl p-6 space-y-4">
                <SummaryRow label="Patient Name" value={form.fullName} />
                <SummaryRow label="Phone" value={form.phone} />
                {form.email && <SummaryRow label="Email" value={form.email} />}
                {form.age && <SummaryRow label="Age" value={form.age} />}
                <SummaryRow label="Gender" value={form.gender} />
                <div className="border-t border-primary/10 pt-4">
                  <SummaryRow label="Department" value={form.department} />
                  <SummaryRow label="Doctor" value={form.doctor} />
                </div>
                <div className="border-t border-primary/10 pt-4">
                  <SummaryRow label="Date" value={form.date} />
                  <SummaryRow label="Time" value={form.time} />
                </div>
                {form.message && (
                  <div className="border-t border-primary/10 pt-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{form.message}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                By confirming, you agree to our hospital's appointment policy.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Next <FaArrowRight className="text-xs" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-secondary text-white font-bold text-sm hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <FaCheckCircle /> Confirm Appointment
          </button>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function inputCls(error?: string) {
  return `w-full border ${error ? "border-red-400 ring-1 ring-red-300" : "border-gray-200"} rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white`;
}

function InputIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{icon}</span>
      {children}
    </div>
  );
}

function Field({ label, error, children, className }: { label: string; error: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-semibold text-right">{value}</span>
    </div>
  );
}
