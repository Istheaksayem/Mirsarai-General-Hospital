import React, { Suspense } from "react";
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
    <div className="min-h-screen flex flex-col">
      {/* ── Hero Banner ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-orange-500 pl-6 animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Book Appointment
            </h1>
            <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
              <span className="text-white">APPOINTMENT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="bg-white/70 backdrop-blur-md border-b border-gray-200/30 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100/50">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 py-5 px-6 transition hover:bg-white/40">
                <span className="text-2xl text-primary shrink-0 drop-shadow-sm">{f.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Area with Abstract BG ── */}
      <section
        className="flex-1 py-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80')" }}
      >
        {/* Soft layout overlay for glassmorphism pop */}
        <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[6px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Info Card */}
              <div className="glass-card rounded-2xl p-6 border border-white/60 shadow-lg hover-lift">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Why Choose Us?</h2>
                <ul className="space-y-3.5 text-sm text-gray-600">
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
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency Banner */}
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-md hover-lift">
                <p className="text-red-600 font-extrabold text-base mb-1 flex items-center gap-1.5">
                  <span className="animate-pulse">🚨</span> Emergency?
                </p>
                <p className="text-red-500 text-sm mb-4 font-medium">Do not use this form. Call us directly.</p>
                <a
                  href="tel:+01969997799"
                  className="block text-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95"
                >
                  Call Emergency: +01969997799
                </a>
              </div>

              {/* Contact Card */}
              <div className="gradient-overlay-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden hover-lift">
                {/* SVG pattern helper for medical texture */}
                <div className="absolute inset-0 medical-pattern opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <p className="font-bold text-lg mb-1">Need Help?</p>
                  <p className="text-blue-200 text-sm mb-4 font-light">Our team is available Mon–Sat, 8AM–8PM</p>
                  <a
                    href="tel:+01969997799"
                    className="block text-center bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm active:scale-95 shadow-inner"
                  >
                    📞 +01969997799
                  </a>
                </div>
              </div>
            </aside>

            {/* Booking Form Card */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-8 sm:p-10 border border-white/60 shadow-2xl">
              <div className="mb-8 border-b border-gray-100/50 pb-4">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Fill in Your Details</h2>
                <p className="text-gray-500 text-sm mt-1.5">Complete the form below to book your appointment.</p>
              </div>
              <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading form...</div>}>
                <AppointmentForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="bg-slate-50/80 border-t border-gray-200/20 py-8 px-4 text-center">
        <p className="text-xs text-gray-400 max-w-7xl mx-auto">
          All appointments are subject to doctor availability. Mirsarai General Hospital · Mirsarai, Chattogram, Bangladesh
        </p>
      </div>
    </div>
  );
}
