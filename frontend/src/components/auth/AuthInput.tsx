import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  registration: UseFormRegisterReturn;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon,
  registration,
  ...rest
}) => {
  return (
    <div className="mb-5 relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...registration}
          {...rest}
          className={`w-full px-4 py-3 rounded-xl border ${error
            ? "border-red-500 focus:ring-red-500/20"
            : "border-gray-200 focus:border-primary focus:ring-primary/20"
            } focus:outline-none focus:ring-4 transition-all duration-300 bg-gray-50/50 hover:bg-white text-gray-800 ${icon ? "pl-10" : ""
            }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default AuthInput;
