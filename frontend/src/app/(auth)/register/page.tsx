import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register | Mirsarai General Hospital",
  description: "Create a new hospital account.",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
