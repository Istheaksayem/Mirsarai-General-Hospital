"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Conditionally hide Navbar & Footer on dashboard and auth paths
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
  const hideShell = isDashboard || isAuth;

  return (
    <LanguageProvider>
      {!hideShell && <Navbar />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!hideShell && <Footer />}
    </LanguageProvider>
  );
}
