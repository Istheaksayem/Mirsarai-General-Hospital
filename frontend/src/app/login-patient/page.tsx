"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiActivity, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { patientAuthSendOtp, patientAuthVerifyOtp } from "@/services/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";

  const [step, setStep] = useState<"email" | "otp">(prefilledEmail ? "otp" : "email");
  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [prefilledEmail]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    setSending(true);
    try {
      const res = await patientAuthSendOtp(email.trim());
      if (res.success === false) throw new Error(res.message || "Failed to send OTP");
      toast.success("OTP sent to your email");
      setStep("otp");
      setResendCooldown(30);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleResendOtp = async () => {
    setSending(true);
    try {
      const res = await patientAuthSendOtp(email.trim());
      if (res.success === false) throw new Error(res.message || "Failed to resend OTP");
      toast.success("OTP resent to your email");
      setResendCooldown(30);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    setVerifying(true);
    try {
      const res = await patientAuthVerifyOtp(email.trim(), otp.trim());
      if (res.success === false) throw new Error(res.message || "Invalid OTP");
      const token = res.data?.token || res.token;
      if (!token) throw new Error("No token received");
      sessionStorage.setItem("mgh_patient_token", token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060913] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E2B7A] to-[#76BC21] text-white shadow-lg mb-4">
            <FiActivity size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Patient Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Mirsarai General Hospital
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f1524] rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-8 shadow-sm">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
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
                disabled={sending}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] disabled:opacity-60 transition-all shadow-sm"
              >
                {sending ? (
                  <FiLoader className="animate-spin" size={16} />
                ) : (
                  <><FiMail size={16} /> Send OTP</>
                )}
              </button>
              <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                A 6-digit OTP will be sent to your email
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
                <FiCheckCircle size={14} className="shrink-0" />
                OTP sent to {email}
              </div>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-xs text-[#1E2B7A] dark:text-[#76BC21] font-bold hover:underline"
              >
                Change email
              </button>
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
                  disabled={verifying || otp.length !== 6}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#243282] text-white text-sm font-bold hover:from-[#1a2368] hover:to-[#1e2b75] disabled:opacity-60 transition-all shadow-sm"
                >
                  {verifying ? (
                    <FiLoader className="animate-spin" size={16} />
                  ) : (
                    <><FiArrowRight size={16} /> Verify & Login</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={sending || resendCooldown > 0}
                  className="text-xs font-bold text-[#1E2B7A] dark:text-[#76BC21] hover:underline disabled:no-underline disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} Mirsarai General Hospital. All rights reserved.
        </p>
      </div>
    </div>
  );
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
