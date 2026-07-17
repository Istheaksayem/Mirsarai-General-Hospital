import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import ThemeProvider from "@/components/ThemeProvider";
import LayoutContent from "@/components/LayoutContent";
import LenisProvider from "@/components/LenisProvider";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mirsarai General Hospital",
  description: "Welcome to Mirsarai General Hospital, where health and care come together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <AuthProvider>
          <QueryProvider>
            <LenisProvider>
              <ThemeProvider>
                <LayoutContent>{children}</LayoutContent>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      borderRadius: "12px",
                      fontWeight: "500",
                      fontSize: "14px",
                    },
                  }}
                />
              </ThemeProvider>
            </LenisProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
