"use client";
import { useState } from "react";
import {
  UserCheck, Mail, Phone, Building2, Award, Calendar,
  Edit2, Save, X, Stethoscope, Clock,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useDoctors } from "@/lib/hooks/useDoctors";

// Mock: currently logged-in doctor is index 0
const DOCTOR_INDEX = 0;

const AVAILABILITY_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorProfilePage() {
  const { data: doctors = [], isLoading } = useDoctors();
  const doctor = doctors[DOCTOR_INDEX];
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Sync editable fields when data loads
  if (doctor && !phone && !email) {
    setPhone(doctor.phone);
    setEmail(doctor.email);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="lg:col-span-2 h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400">
        Doctor profile not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your professional information"
        icon={UserCheck}
      >
        {!editing ? (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Edit2 className="h-4 w-4 mr-1.5" />Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setEditing(false)}>
              <Save className="h-4 w-4 mr-1.5" />Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              <X className="h-4 w-4 mr-1.5" />Cancel
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] text-white text-3xl font-bold shadow-lg">
            {doctor.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{doctor.name}</h2>
          <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-medium mt-0.5">{doctor.specialization}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{doctor.department}</p>

          <Badge
            variant={doctor.status === "active" ? "success" : doctor.status === "on-leave" ? "warning" : "danger"}
            className="mt-3"
          >
            {doctor.status}
          </Badge>

          <div className="mt-6 w-full space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Stethoscope className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Experience</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.experience} years</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Award className="h-4 w-4 text-[#76BC21]" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Qualification</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.qualification}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Joined</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact info */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Phone className="h-3.5 w-3.5" />Phone
                </label>
                {editing ? (
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                ) : (
                  <p className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                    {doctor.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Mail className="h-3.5 w-3.5" />Email
                </label>
                {editing ? (
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:outline-none focus:ring-1 focus:ring-[#1E2B7A]"
                  />
                ) : (
                  <p className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                    {doctor.email}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Building2 className="h-3.5 w-3.5" />Department
                </label>
                <p className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {doctor.department}
                </p>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Stethoscope className="h-3.5 w-3.5" />Specialization
                </label>
                <p className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {doctor.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Performance stats */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Performance Overview</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Total Patients", value: doctor.patientsCount, color: "text-[#1E2B7A] dark:text-blue-400" },
                { label: "Today's Appointments", value: doctor.appointmentsToday, color: "text-[#76BC21]" },
                { label: "Consultation Fee", value: `৳${doctor.consultationFee}`, color: "text-emerald-600 dark:text-emerald-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4 text-center"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly availability */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#76BC21]" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Availability</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_DAYS.map((day) => {
                const isAvailable = doctor.availableDays?.includes(day);
                return (
                  <div
                    key={day}
                    className={[
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      isAvailable
                        ? "border-[#76BC21]/40 bg-[#76BC21]/10 text-[#76BC21] dark:border-[#76BC21]/30 dark:bg-[#76BC21]/10"
                        : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-400",
                    ].join(" ")}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
