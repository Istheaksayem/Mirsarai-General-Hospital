import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | Admin Portal",
};

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f3ff] via-white to-[#f4fce8] dark:from-gray-950 dark:via-[#0b1020] dark:to-[#0d1a07] p-4">
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1E2B7A]/10 blur-3xl dark:bg-[#1E2B7A]/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#76BC21]/10 blur-3xl dark:bg-[#76BC21]/15"
      />

      <Suspense fallback={<div className="text-gray-500 py-10">Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>

      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} Mirsarai General Hospital. All rights
        reserved.
      </p>
    </div>
  );
}
