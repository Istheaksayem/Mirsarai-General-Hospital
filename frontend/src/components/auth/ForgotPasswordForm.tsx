"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );
      
      const resData = await res.json();

      if (!res.ok) {
        toast.error(resData.message || "Something went wrong. Please try again.", {
          id: "forgot-password-error",
        });
        return;
      }

      toast.success(resData.message || "OTP sent to your email.", {
        id: "forgot-password-success",
      });
      
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
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
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot Password</h2>
        <p className="text-gray-500 font-medium">
          Enter your email address and we&apos;ll send you an OTP to reset your password.
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
        />

        <div className="mt-6">
          <SubmitButton text={isSubmitting ? "Sending OTP..." : "Send OTP"} />
        </div>
      </form>

      <p className="text-center mt-8 text-gray-600 font-medium">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default ForgotPasswordForm;
