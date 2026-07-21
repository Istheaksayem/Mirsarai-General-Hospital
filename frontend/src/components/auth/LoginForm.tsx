"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { z } from "zod";

import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import {
  loginSchema,
  LoginFormValues,
  otpSchema,
  OtpFormValues,
} from "@/lib/validations/auth.schema";
import {
  patientAuthCheckStatus,
  patientAuthSetPassword,
  patientAuthLogin,
  patientAuthVerifyOtp,
  patientAuthSendOtp,
} from "@/services/api";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

type FlowPhase =
  | { phase: "checking" }
  | { phase: "login"; email: string }
  | { phase: "set_password"; email: string }
  | { phase: "otp_step"; email: string }
  | { phase: "error"; message: string };

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < current
              ? "w-6 bg-[#1E2B7A]"
              : i === current
                ? "w-6 bg-[#1E2B7A]/60"
                : "w-3 bg-gray-200 dark:bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");

  const [flow, setFlow] = useState<FlowPhase>({ phase: "checking" });
  const [otpSent, setOtpSent] = useState(false);

  // ── Check patient status when email is present in URL ─────────────
  useEffect(() => {
    if (!urlEmail) {
      setFlow({ phase: "login", email: "" });
      return;
    }

    let cancelled = false;

    const check = async () => {
      try {
        const res = await patientAuthCheckStatus(urlEmail);
        if (cancelled) return;

        if (!res.success) {
          setFlow({
            phase: "error",
            message:
              res.message ||
              "Unable to verify your account. Please try again.",
          });
          return;
        }

        const { exists, hasSetPassword } = res.data;

        if (!exists) {
          setFlow({
            phase: "error",
            message:
              "No patient account found with this email. Please book an appointment first.",
          });
          return;
        }

        if (hasSetPassword) {
          setFlow({ phase: "login", email: urlEmail });
        } else {
          setFlow({ phase: "set_password", email: urlEmail });
        }
      } catch {
        if (!cancelled) {
          setFlow({ phase: "login", email: urlEmail || "" });
        }
      }
    };

    check();
    return () => { cancelled = true; };
  }, [urlEmail]);

  // ── Login form (returning patient) ────────────────────────────────
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: flow.phase === "login" ? flow.email : "" },
  });

  useEffect(() => {
    if (flow.phase === "login" && flow.email) {
      loginForm.setValue("email", flow.email);
    }
  }, [flow, loginForm]);

  const onLogin = async (data: LoginFormValues) => {
    try {
      const res = await patientAuthLogin(data.email, data.password);

      if (!res.success) {
        switch (res.errorCode) {
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
          case "ACCOUNT_DEACTIVATED":
            toast.error(
              "Your account has been deactivated. Please contact support.",
              { id: "account-error", icon: "🚫" }
            );
            break;
          default:
            toast.error(res.message || "Login failed. Please try again.", {
              id: "login-error",
            });
        }
        return;
      }

      const token = res.data?.token;
      if (token) {
        sessionStorage.setItem("mgh_patient_token", token);
      }

      const signInRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInRes?.error) {
        toast.error("Login failed. Please try again.", {
          id: "signin-error",
        });
      } else {
        toast.success("Welcome back!", { id: "login-success" });
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: "unexpected-error",
      });
    }
  };

  // ── Set password form (first-time patient) ────────────────────────
  const passwordForm = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onSetPassword = async (data: SetPasswordValues) => {
    if (flow.phase !== "set_password") return;
    try {
      const res = await patientAuthSetPassword(flow.email, data.password);
      if (!res.success) {
        toast.error(res.message || "Failed to set password.", {
          id: "set-pwd-error",
        });
        return;
      }
      setOtpSent(true);
      setFlow({ phase: "otp_step", email: flow.email });
      toast.success("OTP sent to your email!", { id: "otp-sent" });
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: "set-pwd-error",
      });
    }
  };

  // ── OTP Verification form ────────────────────────────────────────
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onVerifyOtp = async (data: OtpFormValues) => {
    if (flow.phase !== "otp_step") return;
    try {
      const res = await patientAuthVerifyOtp(flow.email, data.otp);
      if (!res.success) {
        if (res.errorCode === "OTP_EXPIRED") {
          toast.error("OTP has expired. Please request a new one.", {
            id: "otp-expired",
          });
        } else {
          toast.error(res.message || "Invalid OTP. Please try again.", {
            id: "otp-error",
          });
        }
        return;
      }

      const token = res.data?.token;
      if (token) {
        sessionStorage.setItem("mgh_patient_token", token);
      }

      toast.success("Account verified! Redirecting to your dashboard...", {
        id: "verify-success",
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: "otp-unexpected",
      });
    }
  };

  const handleResendOtp = async () => {
    if (flow.phase !== "otp_step") return;
    try {
      const res = await patientAuthSendOtp(flow.email);
      if (!res.success) {
        toast.error(res.message || "Failed to resend OTP.", {
          id: "resend-error",
        });
        return;
      }
      setOtpSent(true);
      toast.success("OTP resent to your email!", { id: "otp-resent" });
    } catch {
      toast.error("Failed to resend OTP.", { id: "resend-error" });
    }
  };

  // ── Loading state while checking ─────────────────────────────────
  if (flow.phase === "checking") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1E2B7A] border-r-transparent" />
          <p className="mt-4 text-gray-500">Checking your account...</p>
        </div>
      </motion.div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (flow.phase === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <Link
          href="/"
          className="absolute -top-2 right-0 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Go to Home"
        >
          <FiHome size={18} />
        </Link>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Unable to Sign In
          </h2>
          <p className="text-gray-500 font-medium">
            {flow.message}
          </p>
        </div>
        <div className="text-center space-y-3">
          <Link
            href="/login"
            className="inline-block w-full px-6 py-3.5 rounded-xl font-bold bg-[#1E2B7A] text-white hover:bg-[#1E2B7A]/90 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  // ── Login phase (returning patient) ──────────────────────────────
  if (flow.phase === "login") {
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
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium">Sign in to continue</p>
        </div>

        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={<FaEnvelope />}
            registration={loginForm.register("email")}
            error={loginForm.formState.errors.email?.message}
            disabled={!!urlEmail}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            registration={loginForm.register("password")}
            error={loginForm.formState.errors.password?.message}
          />

          <div className="flex items-center justify-between mt-2 mb-6">
            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 mr-2"
                {...loginForm.register("rememberMe")}
              />
              Remember Me
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <SubmitButton
            text={
              loginForm.formState.isSubmitting
                ? "Signing In..."
                : "Sign In"
            }
          />
        </form>
      </motion.div>
    );
  }

  // ── Set Password phase (first-time patient) ──────────────────────
  if (flow.phase === "set_password") {
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
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Set Your Password
          </h2>
          <p className="text-gray-500 font-medium">
            Create a password to access your patient portal
          </p>
        </div>

        <StepIndicator current={0} total={2} />

        <form
          onSubmit={passwordForm.handleSubmit(onSetPassword)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
              <FaEnvelope className="text-gray-400" />
              <span className="text-sm">{flow.email}</span>
            </div>
          </div>

          <PasswordInput
            label="New Password"
            placeholder="At least 6 characters"
            registration={passwordForm.register("password")}
            error={passwordForm.formState.errors.password?.message}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            registration={passwordForm.register("confirmPassword")}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />

          <div className="mt-2 text-xs text-gray-400">
            <p>
              After setting your password, an OTP will be sent to your email
              for verification.
            </p>
          </div>

          <SubmitButton
            text={
              passwordForm.formState.isSubmitting
                ? "Setting Password..."
                : "Set Password & Verify"
            }
          />
        </form>
      </motion.div>
    );
  }

  // ── OTP Verification phase ──────────────────────────────────────
  if (flow.phase === "otp_step") {
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
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-500 font-medium">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-gray-700">{flow.email}</span>
          </p>
        </div>

        <StepIndicator current={1} total={2} />

        <form
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className={`w-full text-center text-2xl tracking-[0.5em] font-bold px-4 py-4 rounded-xl border ${
                otpForm.formState.errors.otp
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-primary focus:ring-primary/20"
              } focus:outline-none focus:ring-4 transition-all duration-300 bg-gray-50/50 text-gray-800`}
              {...otpForm.register("otp")}
            />
            {otpForm.formState.errors.otp && (
              <p className="mt-1.5 text-sm text-red-500 font-medium text-center">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <SubmitButton
            text={
              otpForm.formState.isSubmitting
                ? "Verifying..."
                : "Verify & Access Dashboard"
            }
          />

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Resend OTP
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return null;
};

export default LoginForm;
