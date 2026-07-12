"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Pencil, User, Phone, Mail, Building2, Award, Clock, DollarSign,
  Activity, MapPin, Star, Languages, Eye, Hash
} from "lucide-react";
import { useCmsDoctorById } from "@/lib/hooks/useCmsDoctors";
import { Badge } from "@/components/ui/Badge";
import { Loader2 } from "lucide-react";

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  active: "success",
  "on-leave": "warning",
  inactive: "danger",
};

export default function ViewDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: res, isLoading } = useCmsDoctorById(id);
  const doctor = res?.data as Record<string, unknown> | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center text-gray-400">
        Doctor not found
      </div>
    );
  }

  const name = doctor.name as { en?: string; bn?: string } | undefined;
  const designation = doctor.designation as { en?: string } | undefined;
  const specialization = doctor.specialization as { en?: string } | undefined;
  const dept = doctor.department as { en?: string } | undefined;
  const experience = doctor.experience as { years?: number; label?: { en?: string } } | undefined;
  const availableDays = (doctor.availableDays as string[]) || [];

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/super-admin/doctors")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Doctor Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">View doctor details</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/super-admin/doctors/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-semibold transition-all"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#1E2B7A] to-[#76BC21]" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white dark:border-gray-900 bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] text-white text-2xl font-black shadow-lg">
              {(name?.en || "?").charAt(0)}
            </div>
            <Badge variant={statusVariant[doctor.status as string] ?? "default"}>
              {doctor.status as string}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {name?.en || "Untitled"}
            {!!doctor.featured && <Star className="h-4 w-4 inline ml-2 text-amber-400 fill-amber-400" />}
          </h2>
          <p className="text-sm text-[#76BC21] font-semibold mt-0.5">
            {designation?.en || specialization?.en || ""}
          </p>
          {!!doctor.joinDate && (
            <p className="text-xs text-gray-400 mt-0.5">Joined: {doctor.joinDate as string}</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-5">
          Doctor Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User, label: "Full Name (EN)", value: name?.en },
            { icon: User, label: "Full Name (BN)", value: name?.bn },
            { icon: Award, label: "Designation", value: designation?.en },
            { icon: Award, label: "Specialization", value: specialization?.en },
            { icon: Award, label: "Qualification", value: doctor.qualification as string },
            { icon: Building2, label: "Department", value: dept?.en },
            { icon: Clock, label: "Experience", value: experience?.label?.en || `${experience?.years || 0} years` },
            { icon: Hash, label: "Registration No.", value: doctor.registrationNumber as string },
            { icon: Languages, label: "Languages", value: (doctor.languages as string[])?.join(", ") },
            { icon: Phone, label: "Phone", value: doctor.phone as string },
            { icon: Mail, label: "Email", value: doctor.email as string },
            { icon: MapPin, label: "Chamber Address", value: (doctor.chamberAddress as { en?: string })?.en },
            { icon: Clock, label: "Chamber Time", value: (doctor.chamberTime as { en?: string })?.en },
            { icon: DollarSign, label: "Consultation Fee", value: `৳${((doctor.consultationFee as number) || 0).toLocaleString()}` },
            { icon: Activity, label: "Total Patients", value: String(doctor.patientsCount ?? "N/A") },
            { icon: Eye, label: "Visibility", value: doctor.isVisible ? "Visible" : "Hidden" },
            { icon: Star, label: "Featured", value: doctor.featured ? "Yes" : "No" },
          ]
            .filter((f) => f.value)
            .map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                  <Icon className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
        </div>

        {availableDays.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {availableDays.map((d) => (
                <span key={d} className="px-3 py-1 bg-[#76BC21]/10 text-[#76BC21] rounded-lg text-xs font-semibold">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {(doctor.about as { en?: string })?.en && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">About</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {(doctor.about as { en?: string })?.en}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
