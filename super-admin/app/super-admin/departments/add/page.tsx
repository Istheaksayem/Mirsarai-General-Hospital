"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Redirects to the unified Department CMS editor with id="new"
 */
export default function AddDepartmentRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/super-admin/departments/new/edit");
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
      <p className="text-sm text-gray-400">Opening Department CMS Editor...</p>
    </div>
  );
}
