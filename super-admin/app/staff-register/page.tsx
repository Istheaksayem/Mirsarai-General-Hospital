"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { env } from "@/config/env";

const staffRegisterSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(7, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["doctor", "reception", "lab"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof staffRegisterSchema>;

const BACKEND_URL = env.apiUrl;

const ROLE_OPTIONS: { value: FormValues["role"]; label: string }[] = [
  { value: "doctor", label: "Doctor" },
  { value: "reception", label: "Receptionist" },
  { value: "lab", label: "Lab Admin" },
];

const ROLE_LABELS: Record<string, string> = {
  doctor: "Doctor",
  reception: "Receptionist",
  lab: "Lab Admin",
};

function generateReferenceNumber(id: string): string {
  const year = new Date().getFullYear();
  const suffix = id.slice(-6).toUpperCase();
  return `REG-${year}-${suffix}`;
}

export default function StaffRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ reference: string; role: string } | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [emailForOtp, setEmailForOtp] = useState<string>("");
  const [roleForOtp, setRoleForOtp] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(staffRegisterSchema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register-staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Registration failed");
        return;
      }

      setEmailForOtp(values.email);
      setRoleForOtp(values.role);
      setStep(2);
    } catch {
      setServerError("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setServerError("Please enter the OTP");
      return;
    }

    setServerError(null);
    setIsVerifying(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, otp }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "OTP verification failed");
        setIsVerifying(false);
        return;
      }

      const userId = result.data?.user?._id;
      const reference = userId ? generateReferenceNumber(userId) : "N/A";
      setSuccessData({ reference, role: roleForOtp });
    } catch {
      setServerError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (successData) {
    const roleLabel = ROLE_LABELS[successData.role] || "Staff";
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f3ff] via-white to-[#f4fce8] dark:from-gray-950 dark:via-[#0b1020] dark:to-[#0d1a07] p-4">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1E2B7A]/10 blur-3xl dark:bg-[#1E2B7A]/20" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#76BC21]/10 blur-3xl dark:bg-[#76BC21]/15" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" strokeWidth={1.8} />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
              Registration Submitted!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Your {roleLabel} registration has been submitted successfully.
            </p>

            <div className="rounded-xl border border-dashed border-[#1E2B7A]/30 dark:border-blue-500/30 bg-[#1E2B7A]/5 dark:bg-blue-500/10 px-4 py-4 mb-6">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">
                Reference Number
              </p>
              <p className="text-lg font-bold tracking-wider text-[#1E2B7A] dark:text-blue-400">
                {successData.reference}
              </p>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              Please wait until a Super Admin reviews and approves your account. You will be able to
              log in once approved.
            </p>

            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#1E2B7A] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1E2B7A]/30 hover:bg-[#2d3fa8] transition-colors"
            >
              Go to Login
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 2 && !successData) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f3ff] via-white to-[#f4fce8] dark:from-gray-950 dark:via-[#0b1020] dark:to-[#0d1a07] p-4">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1E2B7A]/10 blur-3xl dark:bg-[#1E2B7A]/20" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#76BC21]/10 blur-3xl dark:bg-[#76BC21]/15" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 p-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
              Verify OTP
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We've sent a 6-digit OTP to <span className="font-semibold text-gray-700 dark:text-gray-300">{emailForOtp}</span>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="Enter OTP"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />

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

              <Button type="submit" size="lg" loading={isVerifying} className="w-full">
                Verify OTP
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f3ff] via-white to-[#f4fce8] dark:from-gray-950 dark:via-[#0b1020] dark:to-[#0d1a07] p-4">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1E2B7A]/10 blur-3xl dark:bg-[#1E2B7A]/20" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#76BC21]/10 blur-3xl dark:bg-[#76BC21]/15" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E2B7A] to-[#2d3fa8] shadow-lg shadow-[#1E2B7A]/30">
              <Briefcase className="h-7 w-7 text-white" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Staff Registration
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Mirsarai General Hospital
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                Staff Role <span className="text-red-500">*</span>
              </label>
              <select
                {...register("role")}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 focus:border-[#1E2B7A] dark:focus:border-[#4a5fd4] transition-all"
              >
                <option value="">Select a role…</option>
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              autoComplete="name"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@mgh.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              autoComplete="tel"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

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
              {isSubmitting ? "Submitting…" : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-[#1E2B7A] hover:text-[#2d3fa8] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
