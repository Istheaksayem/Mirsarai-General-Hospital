"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Registration failed");
        return;
      }

      // If registration is successful, log them in automatically using NextAuth
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        setServerError("Registration successful, but auto-login failed. Please sign in manually.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        router.push("/dashboard"); // Redirect to appropriate page
        router.refresh();
      }
    } catch (error: any) {
      setServerError("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-gray-500 font-medium">Join our hospital portal to access healthcare services.</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          label="Full Name"
          placeholder="Enter your full name"
          icon={<FaUser />}
          registration={register("fullName")}
          error={errors.fullName?.message}
        />

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<FaEnvelope />}
          registration={register("email")}
          error={errors.email?.message}
        />

        <AuthInput
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          icon={<FaPhone />}
          registration={register("phone")}
          error={errors.phone?.message}
        />

        <PasswordInput
          label="Password"
          placeholder="Create password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="mb-8 pt-2">
          <label className="flex items-start text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 mr-3"
              {...register("terms")}
            />
            <span className="leading-tight">
              I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
        </div>

        <SubmitButton text={isSubmitting ? "Creating Account..." : "Create Account"} />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
          </div>
        </div>

        <GoogleButton />
      </form>

      <p className="text-center mt-8 text-gray-600 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
