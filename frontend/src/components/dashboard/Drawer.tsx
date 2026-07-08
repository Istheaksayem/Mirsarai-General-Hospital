"use client";

import React, { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footerActions,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Wrapper */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-[#090d16] border-l border-slate-200/60 dark:border-slate-800/80 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/40 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold leading-normal">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {children}
            </div>

            {/* Footer */}
            {footerActions && (
              <div className="px-6 py-4.5 bg-slate-50/30 dark:bg-slate-900/5 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-end gap-3.5">
                {footerActions}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
