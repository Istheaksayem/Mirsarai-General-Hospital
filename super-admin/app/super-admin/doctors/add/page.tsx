"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Redirects to the unified Doctor CMS editor with id="new"
 * The editor handles both create (new) and edit (existing id) modes
 */
export default function AddDoctorRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/super-admin/doctors/new/edit");
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
      <p className="text-sm text-gray-400">Opening Doctor CMS Editor...</p>
    </div>
  );
}
