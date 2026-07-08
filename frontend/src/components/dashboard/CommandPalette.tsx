"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiMonitor, FiUser, FiSliders, FiSun, FiMoon } from "react-icons/fi";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
  onSwitchRole: (role: string) => void;
  onToggleTheme: () => void;
  currentRole: string;
  modules: string[];
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onSwitchRole,
  onToggleTheme,
  currentRole,
  modules,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close command palette on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  // Reset index on search
  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  if (!isOpen) return null;

  // Flattened commands
  const navigationCommands = modules.map((mod) => ({
    category: "Navigation",
    label: `Go to ${mod}`,
    action: () => onNavigate(mod),
    icon: <FiMonitor className="text-gray-400" />,
  }));

  const roleCommands = [
    { label: "Switch to Super Admin", value: "super-admin", icon: "👑" },
    { label: "Switch to Reception Admin", value: "reception-admin", icon: "🛎️" },
    { label: "Switch to Lab Admin", value: "lab-admin", icon: "🧪" },
    { label: "Switch to Doctor", value: "doctor", icon: "🩺" },
  ]
    .filter((r) => r.value !== currentRole)
    .map((r) => ({
      category: "Roles",
      label: r.label,
      action: () => onSwitchRole(r.value),
      icon: <span className="text-sm">{r.icon}</span>,
    }));

  const preferenceCommands = [
    {
      category: "Preferences",
      label: "Toggle Dark / Light Theme",
      action: onToggleTheme,
      icon: <FiSun className="text-gray-400" />,
    },
  ];

  const allCommands = [...navigationCommands, ...roleCommands, ...preferenceCommands];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (idx: number) => {
    if (filteredCommands[idx]) {
      filteredCommands[idx].action();
      onClose();
      setSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(activeIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4 animate-fadeIn">
      <div
        ref={containerRef}
        className="w-full max-w-xl bg-white/95 dark:bg-[#090d16]/95 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/60 overflow-hidden"
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800/40">
          <FiSearch className="text-slate-400 dark:text-slate-550" size={18} />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-450 text-sm focus:outline-none font-semibold"
            autoFocus
          />
          <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded">
            ESC
          </span>
        </div>

        {/* Commands List */}
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <div>
              {/* Render by Category Groupings */}
              {["Navigation", "Roles", "Preferences"].map((cat) => {
                const catCommands = filteredCommands.filter((cmd) => cmd.category === cat);
                if (catCommands.length === 0) return null;

                return (
                  <div key={cat} className="space-y-0.5">
                    <div className="px-3.5 py-2 text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
                      {cat}
                    </div>
                    {catCommands.map((cmd) => {
                      const absoluteIdx = filteredCommands.indexOf(cmd);
                      const isActive = activeIndex === absoluteIdx;

                      return (
                        <button
                          key={cmd.label}
                          onClick={() => handleSelect(absoluteIdx)}
                          onMouseEnter={() => setActiveIndex(absoluteIdx)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-155 cursor-pointer ${
                            isActive
                              ? "bg-[#1E2B7A] text-white dark:bg-accent/15 dark:text-accent border border-transparent dark:border-accent/20"
                              : "text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {cmd.icon}
                            <span>{cmd.label}</span>
                          </div>
                          {isActive && (
                            <span className="text-[9px] font-black opacity-60">
                              ↵ Enter
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-550 font-bold">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-5 py-3.5 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800/40 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          <div className="flex gap-4">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Ctrl+K to close</span>
        </div>
      </div>
    </div>
  );
}
