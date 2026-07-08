import React from "react";
import type { Metadata } from "next";
import { FaHospital, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import AppointmentForm from "@/components/appointment/AppointmentForm";

export const metadata: Metadata = {
  title: "Book an Appointment | Mirsarai General Hospital",
  description:
    "Schedule an appointment with our specialist doctors at Mirsarai General Hospital. Fast, easy, and secure online booking.",
};

const features = [
  { icon: <FaHospital />, title: "Expert Specialists", desc: "Board-certified doctors across all departments." },
  { icon: <MdVerified />, title: "Instant Confirmation", desc: "Get immediate appointment confirmation." },
  { icon: <FaShieldAlt />, title: "Secure & Private", desc: "Your health data is 100% confidential." },
  { icon: <FaHeadset />, title: "24/7 Support", desc: "Our team is always here to help you." },
];

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-primary py-20">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#76BC21]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-40 w-40 h-40 bg-[#00BCD4]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-white/20 backdrop-blur-sm">
            Online Appointment Booking
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Book Your <span className="text-[#76BC21]">Appointment</span> Today
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Schedule a consultation with our world-class medical specialists in just a few simple steps.
          </p>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 py-5 px-6">
                <span className="text-2xl text-primary shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Info Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    "Over 50 specialist doctors",
                    "Modern diagnostic equipment",
                    "Comfortable private rooms",
                    "Insurance & cash payment",
                    "Emergency care 24/7",
                    "Free follow-up consultation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency Banner */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <p className="text-red-600 font-bold text-base mb-1">🚨 Emergency?</p>
                <p className="text-red-500 text-sm mb-3">Do not use this form. Call us directly.</p>
                <a
                  href="tel:+01969997799"
                  className="block text-center bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition text-sm"
                >
                  Call Emergency: +01969997799
                </a>
              </div>

              {/* Contact Card */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <p className="font-bold text-base mb-1">Need Help?</p>
                <p className="text-blue-200 text-sm mb-4">Our team is available Mon–Sat, 8AM–8PM</p>
                <a href="tel:+01969997799" className="block text-center bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                  📞 +01969997799
                </a>
              </div>
            </aside>

            {/* Booking Form Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-lg p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">Fill in Your Details</h2>
                <p className="text-gray-500 text-sm mt-1">Complete the form below to book your appointment.</p>
              </div>
              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <p className="text-center text-xs text-gray-400">
          All appointments are subject to doctor availability. Mirsarai General Hospital · Mirsarai, Chattogram, Bangladesh
        </p>
      </div>
    </div>
  );
}
