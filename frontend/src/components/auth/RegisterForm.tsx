"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { registerSchema, RegisterFormValues, otpSchema, OtpFormValues } from "@/lib/validations/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [registeredData, setRegisteredData] = useState<{ email: string, password: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
    reset: resetOtpForm,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (step === 2) {
      resetOtpForm({ otp: "" });
    }
  }, [step, resetOtpForm]);

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

      setRegisteredData({ email: data.email, password: data.password });
      setStep(2);
      setServerError(null);
    } catch (error: any) {
      setServerError("An error occurred. Please try again.");
    }
  };

  const onOtpVerification = async (data: OtpFormValues) => {
    setServerError(null);
    if (!registeredData) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredData.email,
          otp: data.otp,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "OTP verification failed");
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: registeredData.email,
        password: registeredData.password,
      });

      if (signInResult?.error) {
        setServerError("Registration successful, but auto-login failed. Please sign in manually.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        router.push("/dashboard");
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
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          {step === 1 ? "Create Your Account" : "Verify Your Email"}
        </h2>
        <p className="text-gray-500 font-medium">
          {step === 1
            ? "Join our hospital portal to access healthcare services."
            : `We've sent a 6-digit OTP to ${registeredData?.email}. Please enter it below.`}
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
          {serverError}
        </div>
      )}

      {step === 1 ? (
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

          <SubmitButton text={isSubmitting ? "Sending OTP..." : "Create Account"} />

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
      ) : (
        <form key={step} autoComplete="off" onSubmit={handleOtpSubmit(onOtpVerification)} className="space-y-5">
          <AuthInput
            label="One-Time Password (OTP)"
            placeholder="Enter OTP"
            autoComplete="off"
            icon={<FaEnvelope />}
            registration={registerOtp("otp")}
            error={otpErrors.otp?.message}
          />

          <SubmitButton text={isOtpSubmitting ? "Verifying..." : "Verify & Complete Registration"} />

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            Go back to registration form
          </button>
        </form>
      )}

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
