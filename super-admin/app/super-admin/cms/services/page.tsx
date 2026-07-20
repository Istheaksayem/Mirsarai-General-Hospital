"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const SERVICE_TYPES = [
  {
    type: "diagnostic",
    label: "Diagnostic Services",
    description: "Tests, features, working hours, statistics & SEO",
    href: "/super-admin/cms/services/diagnostic",
  },
  {
    type: "nicu",
    label: "NICU & Baby Care",
    description: "Neonatal services, equipment, vaccination schedule, guidelines, working hours, statistics & SEO",
    href: "/super-admin/cms/services/nicu",
  },
  {
    type: "listing",
    label: "Services Listing",
    description: "Manage service cards shown on homepage & services page — add, edit, reorder, delete",
    href: "/super-admin/cms/services/listing",
  },
];

export default function ServicePagesCmsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          type="button"
          onClick={() => router.push("/super-admin/cms")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <PageHeader title="Service Pages CMS" description="Manage detailed service page content for Diagnostic, NICU, and Baby Care" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SERVICE_TYPES.map(({ type, label, description, href }) => (
          <div
            key={type}
            onClick={() => router.push(href)}
            className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{label}</h3>
              <p className="text-sm text-gray-400 mb-6">{description}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1E2B7A] dark:text-blue-400 group-hover:gap-3 transition-all">
                <span>Manage Content</span>
                <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
