"use client";

import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  registration,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-5 relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <FaLock />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          {...registration}
          {...rest}
          className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-200 focus:border-primary focus:ring-primary/20"
          } focus:outline-none focus:ring-4 transition-all duration-300 bg-gray-50/50 hover:bg-white text-gray-800`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;
