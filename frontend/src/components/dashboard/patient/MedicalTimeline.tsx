"use client";
import { FiCalendar, FiFileText, FiActivity, FiHeart, FiAlertCircle } from "react-icons/fi";

const timeline = [
  {
    date: "July 10, 2026", category: "Lab Report", icon: FiFileText, color: "bg-green-100 dark:bg-green-900/30 text-green-600",
    title: "CBC Blood Test",
    details: "Hemoglobin: 13.2 g/dL · WBC: 7,800/μL · Platelets: 2,10,000/μL",
    doctor: "Dr. Mahmud (Pathology)",
  },
  {
    date: "July 5, 2026", category: "Consultation", icon: FiActivity, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    title: "Medicine Consultation — Hypertension Follow-up",
    details: "BP: 138/90 mmHg. Medication adjusted: Amlodipine 5mg added. Next visit in 1 month.",
    doctor: "Dr. Abdullah Al Mamun (Medicine)",
  },
  {
    date: "June 20, 2026", category: "Consultation", icon: FiHeart, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600",
    title: "Gynecology — Prenatal Care Week 28",
    details: "Fetal heartbeat normal. Weight gain on track. Iron supplement prescribed.",
    doctor: "Dr. Farhana Rahman (Gynecology)",
  },
  {
    date: "June 10, 2026", category: "Radiology", icon: FiActivity, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    title: "Abdominal Ultrasound",
    details: "Liver: Normal echogenicity. Gallbladder: No stones. Kidneys: Bilateral normal size.",
    doctor: "Dr. Nusrat Jahan (Radiology)",
  },
  {
    date: "May 20, 2026", category: "Lab Report", icon: FiFileText, color: "bg-green-100 dark:bg-green-900/30 text-green-600",
    title: "Lipid Profile",
    details: "Total Cholesterol: 195 mg/dL · LDL: 118 mg/dL · HDL: 48 mg/dL · Triglycerides: 145 mg/dL",
    doctor: "Dr. Mahmud (Pathology)",
  },
  {
    date: "April 15, 2026", category: "Cardiology", icon: FiHeart, color: "bg-red-100 dark:bg-red-900/30 text-red-600",
    title: "Echocardiogram",
    details: "EF: 60%. No wall motion abnormality. Mild MR. Aortic valve normal.",
    doctor: "Dr. Nasrin Ahmed (Cardiology)",
  },
  {
    date: "March 12, 2024", category: "Registration", icon: FiAlertCircle, color: "bg-slate-100 dark:bg-slate-800 text-slate-500",
    title: "Patient Registered at Mirsarai General Hospital",
    details: "Patient ID: MGH-2026-000001 issued. Initial health assessment completed.",
    doctor: "Reception Admin",
  },
];

export default function MedicalTimeline() {
  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-slate-500 dark:text-slate-400">{timeline.length} events in your medical history</p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-6">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4">
              {/* Icon node */}
              <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.color}`}>
                <item.icon size={15} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-black ${item.color} mr-2`}>{item.category}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.details}</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-semibold">👤 {item.doctor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
