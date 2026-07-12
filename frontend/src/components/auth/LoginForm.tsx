"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setServerError(res.error);
      } else {
        router.push("/dashboard"); // Adjust to your desired post-login route
        router.refresh();
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
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
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 font-medium">Sign in to continue</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
          {serverError}
        </div>
      )}

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
          <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Forgot Password?
          </a>
        </div>

        <SubmitButton text={isSubmitting ? "Signing In..." : "Sign In"} />

        <div className="relative my-8">
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
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
          Create Account
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
