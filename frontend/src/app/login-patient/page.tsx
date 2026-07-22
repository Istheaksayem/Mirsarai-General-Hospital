"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PatientLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      router.replace(`/login?email=${encodeURIComponent(email)}`);
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return null;
}

export default function PatientLoginPage() {
  return (
    <Suspense fallback={null}>
      <PatientLoginRedirect />
    </Suspense>
  );
}
