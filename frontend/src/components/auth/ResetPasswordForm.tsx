"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const resetPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam || "",
    }
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      
      const resData = await res.json();

      if (!res.ok) {
        toast.error(resData.message || "Failed to reset password. Please try again.", {
          id: "reset-password-error",
        });
        return;
      }

      toast.success("Password reset successful! You can now sign in.", {
        id: "reset-password-success",
      });
      
      router.push("/login");
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: "unexpected-error",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-500 font-medium">
          Enter the 6-digit OTP sent to your email and your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<FaEnvelope />}
          registration={register("email")}
          error={errors.email?.message}
          disabled={!!emailParam}
        />

        <AuthInput
          label="OTP (One Time Password)"
          type="text"
          placeholder="123456"
          icon={<FaKey />}
          registration={register("otp")}
          error={errors.otp?.message}
        />

        <PasswordInput
          label="New Password"
          placeholder="Enter your new password"
          registration={register("newPassword")}
          error={errors.newPassword?.message}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm your new password"
          registration={register("confirmNewPassword")}
          error={errors.confirmNewPassword?.message}
        />

        <div className="mt-6">
          <SubmitButton text={isSubmitting ? "Resetting Password..." : "Reset Password"} />
        </div>
      </form>

      <p className="text-center mt-8 text-gray-600 font-medium">
        Back to{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default ResetPasswordForm;
