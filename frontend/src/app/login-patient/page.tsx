"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PatientLoginPage() {
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
