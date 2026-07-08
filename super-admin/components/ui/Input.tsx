import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-gray-400 dark:text-gray-500">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border bg-white dark:bg-gray-900",
              "px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100",
              "placeholder:text-gray-400 dark:placeholder:text-gray-600",
              "border-gray-200 dark:border-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 focus:border-[#1E2B7A] dark:focus:border-[#4a5fd4]",
              "transition-all duration-150",
              "disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-red-400 focus:ring-red-300 focus:border-red-400",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 flex items-center text-gray-400 dark:text-gray-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
