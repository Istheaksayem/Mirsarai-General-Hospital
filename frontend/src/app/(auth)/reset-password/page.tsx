import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password - Mirsarai General Hospital",
  description: "Set your new password for Mirsarai General Hospital",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500 py-10">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
