"use client";
import { useState } from "react";
import { FiUser, FiPhone, FiMail, FiMapPin, FiEdit2, FiSave, FiX } from "react-icons/fi";

const patient = {
  name: "Aminul Islam", dob: "1981-03-15", age: 45, gender: "Male",
  phone: "01711-234567", email: "aminul@example.com",
  address: "Mirsarai, Chittagong", bloodGroup: "A+",
  patientId: "MGH-2026-000001", registrationDate: "2024-03-12",
  emergencyContact: "Fatima Islam — 01812-345678",
  allergies: "Penicillin", medicalConditions: "Hypertension, Type 2 Diabetes",
};

export default function PatientProfile() {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);
  const [address, setAddress] = useState(patient.address);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header card */}
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#1E2B7A] to-[#243282]" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="h-20 w-20 rounded-2xl border-4 border-white dark:border-[#0f1524] bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {patient.name.charAt(0)}
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-xs font-bold transition-all">
                  <FiEdit2 size={13} /> Edit
                </button>
              ) : (
                <>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2 bg-[#76BC21] text-white rounded-xl text-xs font-bold">
                    <FiSave size={13} /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold">
                    <FiX size={13} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h2>
          <p className="font-mono text-sm text-[#1E2B7A] dark:text-[#76BC21] font-bold mt-0.5">{patient.patientId}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {[`Age: ${patient.age}`, patient.gender, `Blood: ${patient.bloodGroup}`].map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-5">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: FiPhone, label: "Phone", value: phone, key: "phone", edit: setPhone },
            { icon: FiMail, label: "Email", value: email, key: "email", edit: setEmail },
          ].map(f => (
            <div key={f.key} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="h-9 w-9 rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center shrink-0">
                <f.icon size={15} className="text-[#1E2B7A] dark:text-[#76BC21]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase">{f.label}</p>
                {editing ? (
                  <input value={f.value} onChange={e => f.edit(e.target.value)}
                    className="mt-1 w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]" />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{f.value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="h-9 w-9 rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center shrink-0">
              <FiMapPin size={15} className="text-[#1E2B7A] dark:text-[#76BC21]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
              {editing ? (
                <input value={address} onChange={e => setAddress(e.target.value)}
                  className="mt-1 w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]" />
              ) : (
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{address}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical info */}
      <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Medical Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "DOB", value: `${patient.dob} (Age ${patient.age})` },
            { label: "Emergency Contact", value: patient.emergencyContact },
            { label: "Known Allergies", value: patient.allergies },
            { label: "Medical Conditions", value: patient.medicalConditions },
          ].map(f => (
            <div key={f.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{f.label}</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
