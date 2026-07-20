"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { motion } from "framer-motion";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Step 1: Call backend directly to detect field-specific errors
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );
      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        // Use errorCode for precise field-specific toast messages
        switch (checkData.errorCode) {
          case "EMAIL_NOT_FOUND":
            toast.error("No account found with this email address.", {
              id: "email-error",
              icon: "✉️",
            });
            break;
          case "WRONG_PASSWORD":
            toast.error("Incorrect password. Please try again.", {
              id: "password-error",
              icon: "🔒",
            });
            break;
          case "EMAIL_NOT_VERIFIED":
            toast.error(
              "Your email is not verified. Please complete OTP verification first.",
              { id: "verify-error", icon: "📧" }
            );
            break;
          case "ACCOUNT_DEACTIVATED":
            toast.error(
              "Your account has been deactivated. Please contact support.",
              { id: "account-error", icon: "🚫" }
            );
            break;

          default:
            toast.error(checkData.message || "Login failed. Please try again.", {
              id: "login-error",
            });
        }
        return;
      }

      // Store token for patient portal API access
      const token = checkData?.data?.token;
      if (token) sessionStorage.setItem("mgh_patient_token", token);

      // Step 2: Credentials are valid — now use NextAuth signIn for session
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast.error("Login failed. Please try again.", { id: "signin-error" });
      } else {
        toast.success("Welcome back! Signing you in...", { id: "login-success" });
        const role = checkData?.data?.user?.role;
        if (role === "doctor") {
          router.push("/dashboard/doctor");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
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
      className="w-full max-w-md mx-auto relative"
    >
      <Link
        href="/"
        className="absolute -top-2 right-0 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Go to Home"
      >
        <FiHome size={18} />
      </Link>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 font-medium">Sign in to continue</p>
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

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between mt-2 mb-6">
          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 mr-2"
              {...register("rememberMe")}
            />
            Remember Me
          </label>
          <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <SubmitButton text={isSubmitting ? "Signing In..." : "Sign In"} />
      </form>
    </motion.div>
  );
};

export default LoginForm;
