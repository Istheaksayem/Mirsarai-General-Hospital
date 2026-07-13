"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface GoogleButtonProps {
  text?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ text = "Continue with Google" }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: true 
      });
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.", { id: "google-error" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-sm"
    >
      <FaGoogle className="text-red-500 text-lg" />
      <span>{text}</span>
    </button>
  );
};

export default GoogleButton;
