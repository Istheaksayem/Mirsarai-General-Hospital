"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

// Quick-fill demo accounts
const DEMO_ACCOUNTS = [
  { label: "Super Admin", email: "superadmin@mgh.com" },
  { label: "Reception", email: "reception@mgh.com" },
  { label: "Lab Admin", email: "lab@mgh.com" },
  { label: "Doctor", email: "doctor@mgh.com" },
];

export function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await login(values);
    if (result.error) setServerError(result.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E2B7A] to-[#2d3fa8] shadow-lg shadow-[#1E2B7A]/30">
            <ShieldCheck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Admin Portal
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Mirsarai General Hospital
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@mgh.com"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {/* Server error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
                  {serverError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400 dark:text-gray-500">
                Demo accounts (password: admin123)
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setValue("email", acc.email);
                  setValue("password", "admin123");
                }}
                className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-left transition-colors hover:border-[#1E2B7A]/40 hover:bg-[#1E2B7A]/5 dark:hover:bg-[#1E2B7A]/20"
              >
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {acc.label}
                </p>
                <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                  {acc.email}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff registration link */}
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Don&apos;t have an account?{" "}
        <a
          href="/staff-register"
          className="font-semibold text-[#1E2B7A] hover:text-[#2d3fa8] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Register here
        </a>
      </p>
    </motion.div>
  );
}
