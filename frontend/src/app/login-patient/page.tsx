"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiActivity, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  patientAuthCheckStatus,
  patientAuthSetPassword,
  patientAuthLogin,
  patientAuthSendOtp,
  patientAuthVerifyOtp,
} from "@/services/api";

type PageState =
  | "init"
  | "noEmail"
  | "notFound"
  | "setPassword"
  | "otp"
  | "login"
  | "error";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";

  const [pageState, setPageState] = useState<PageState>("init");
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const checkStatus = useCallback(async (e?: string) => {
    const target = e || email;
    if (!target.trim()) { setPageState("noEmail"); return; }
    setLoading(true);
    try {
      const res = await patientAuthCheckStatus(target.trim());
      if (res.success === false) throw new Error(res.message || "Check failed");
      const status = res.data;
      if (!status.exists) {
        setPageState("notFound");
      } else if (!status.hasSetPassword) {
        setPageState("setPassword");
      } else {
        setPageState("login");
      }
    } catch {
      setPageState("error");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
      checkStatus(prefilledEmail);
    } else {
      setPageState("noEmail");
    }
  }, [prefilledEmail, checkStatus]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await patientAuthSetPassword(email.trim(), password);
      if (res.success === false) throw new Error(res.message || "Failed to set password");
      toast.success("Password set! Check your email for the OTP.");
      setPageState("otp");
      setResendCooldown(30);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await patientAuthSendOtp(email.trim());
      if (res.success === false) throw new Error(res.message || "Failed to send OTP");
      toast.success("OTP sent to your email");
      setPageState("otp");
      setResendCooldown(30);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await patientAuthVerifyOtp(email.trim(), otp.trim());
      if (res.success === false) throw new Error(res.message || "Invalid OTP");
      const token = res.data?.token || res.token;
      if (!token) throw new Error("No token received");
      sessionStorage.setItem("mgh_patient_token", token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { toast.error("Please enter your password"); return; }
    setLoading(true);
    try {
      const res = await patientAuthLogin(email.trim(), password);
      if (res.success === false) throw new Error(res.message || "Login failed");
      const token = res.data?.token || res.token;
      if (!token) throw new Error("No token received");
      sessionStorage.setItem("mgh_patient_token", token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E2B7A] to-[#76BC21] text-white shadow-lg mb-4">
        <FiActivity size={28} />
      </div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Patient Portal</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
        Mirsarai General Hospital
      </p>
    </div>
  );

  const container = (children: React.ReactNode) => (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060913] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {pageTitle}
        <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-8 shadow-sm">
          {children}
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} Mirsarai General Hospital. All rights reserved.
        </p>
      </div>
    </div>
  );

  if (pageState === "init") {
    return container(
      <div className="flex flex-col items-center py-8">
        <FiLoader className="animate-spin text-[#1E2B7A]" size={28} />
        <p className="text-sm text-slate-500 mt-3">Checking account...</p>
      </div>
    );
  }

  if (pageState === "error") {
    return container(
      <div className="text-center py-6 space-y-4">
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        <button
          onClick={() => checkStatus()}
          className="px-5 py-2 rounded-xl bg-[#1E2B7A] text-white text-sm font-bold hover:bg-[#1a2368] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (pageState === "noEmail") {
    return container(
      <form
        onSubmit={(e) => { e.preventDefault(); checkStatus(); }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 dark:focus:ring-[#76BC21]/40 transition"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] disabled:opacity-60 transition-all shadow-sm"
        >
          {loading ? <FiLoader className="animate-spin" size={16} /> : <><FiMail size={16} /> Continue</>}
        </button>
      </form>
    );
  }

  if (pageState === "notFound") {
    return container(
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <FiMail className="text-red-500" size={22} />
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
          No account found with this email.
        </p>
        <p className="text-xs text-slate-400">
          Please book an appointment first to receive your portal invitation.
        </p>
        <button
          onClick={() => router.push("/appointment")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] transition-all shadow-sm"
        >
          Book an Appointment
        </button>
        {prefilledEmail && (
          <button
            onClick={() => { setPageState("noEmail"); setEmail(""); }}
            className="block mx-auto text-xs text-[#1E2B7A] dark:text-[#76BC21] font-bold hover:underline"
          >
            Try a different email
          </button>
        )}
      </div>
    );
  }

  if (pageState === "setPassword") {
    return container(
      <form onSubmit={handleSetPassword} className="space-y-5">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
          <FiCheckCircle size={14} className="shrink-0" />
          Set your password for {email}
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 dark:focus:ring-[#76BC21]/40 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              minLength={6}
              required
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 dark:focus:ring-[#76BC21]/40 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || password.length < 6 || password !== confirmPassword}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] disabled:opacity-60 transition-all shadow-sm"
        >
          {loading ? (
            <FiLoader className="animate-spin" size={16} />
          ) : (
            <><FiArrowRight size={16} /> Set Password</>
          )}
        </button>
      </form>
    );
  }

  if (pageState === "otp") {
    return container(
      <form onSubmit={handleVerifyOtp} className="space-y-5">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
          <FiCheckCircle size={14} className="shrink-0" />
          OTP sent to {email}
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            One-Time Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              required
              autoFocus
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 dark:focus:ring-[#76BC21]/40 transition tracking-widest text-center text-lg font-bold"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] disabled:opacity-60 transition-all shadow-sm"
          >
            {loading ? (
              <FiLoader className="animate-spin" size={16} />
            ) : (
              <><FiArrowRight size={16} /> Verify & Login</>
            )}
          </button>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || resendCooldown > 0}
            className="text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline disabled:no-underline disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </div>
      </form>
    );
  }

  if (pageState === "login") {
    return container(
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
          <FiCheckCircle size={14} className="shrink-0" />
          Welcome back, {email}
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type={showLoginPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 dark:focus:ring-[#76BC21]/40 transition"
            />
            <button
              type="button"
              onClick={() => setShowLoginPwd(!showLoginPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showLoginPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] disabled:opacity-60 transition-all shadow-sm"
        >
          {loading ? (
            <FiLoader className="animate-spin" size={16} />
          ) : (
            <><FiArrowRight size={16} /> Login</>
          )}
        </button>
        {prefilledEmail && (
          <button
            type="button"
            onClick={() => { setPageState("noEmail"); setEmail(""); setPassword(""); }}
            className="block mx-auto text-xs text-[#1E2B7A] dark:text-[#76BC21] font-bold hover:underline"
          >
            Use a different email
          </button>
        )}
      </form>
    );
  }

  return null;
}

export default function PatientLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50/50 dark:bg-[#060913] flex items-center justify-center">
        <FiLoader className="animate-spin text-[#1E2B7A]" size={32} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
