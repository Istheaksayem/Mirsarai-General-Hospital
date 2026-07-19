import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password - Mirsarai General Hospital",
  description: "Reset your password for Mirsarai General Hospital",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
