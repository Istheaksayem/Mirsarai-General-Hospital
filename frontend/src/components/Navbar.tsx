"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

type NavItem = {
  type: "link" | "dropdown";
  name: string;
  href?: string;
  links?: { name: string; href: string }[];
};

const navItems: NavItem[] = [
  { type: "link", name: "Home", href: "/" },
  {
    type: "dropdown",
    name: "Doctors",
    links: [
      { name: "Doctor Directory", href: "/doctors" },
      { name: "Doctor Profiles", href: "/doctors/profiles" },
    ],
  },
  {
    type: "dropdown",
    name: "Services",
    links: [
      { name: "Diagnostic Services", href: "/services/diagnostic" },
      { name: "NICU & Baby Care", href: "/services/nicu" },
    ],
  },
  {
    type: "dropdown",
    name: "About",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Mission-Vision", href: "/about/mission-vision" },
    ],
  },
  { type: "link", name: "Departments", href: "/departments" },
  { type: "link", name: "Appointment", href: "/appointment" },
  { type: "link", name: "Contact", href: "/contact" },
];

// ---- Reusable Desktop Dropdown ----
const DesktopDropdown = ({
  label,
  links,
}: {
  label: string;
  links: { name: string; href: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="px-4 py-2 rounded-full text-[#4e5b6f] font-semibold text-[15px] hover:bg-primary/5 hover:text-[#3b82f6] transition-all duration-300">
        {label}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[100%] left-0 mt-0 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100/50 py-3 z-50"
        >
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-5 py-2.5 text-[14px] text-[#4e5b6f] hover:text-[#3b82f6] hover:bg-blue-50/50 hover:pl-6 transition-all duration-300 font-semibold"
            >
              {item.name}
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// ---- Reusable Mobile Dropdown ----
const MobileDropdown = ({
  label,
  links,
}: {
  label: string;
  links: { name: string; href: string }[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[#4e5b6f] hover:text-[#3b82f6] hover:bg-gray-50 rounded-md font-semibold"
      >
        {label}
        <span className="text-xl leading-none">{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#3b82f6]/20 pl-3">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-[14px] text-gray-600 hover:text-[#3b82f6] hover:bg-gray-50 rounded-md font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Main Navbar ----
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer mr-2 xl:mr-8">
            <img className="h-10 w-auto" src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" />
          </div>

          {/* Desktop Menu - Center aligned links separated by dots */}
          <div className="hidden xl:flex flex-1 justify-center items-center h-full">
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                {item.type === "dropdown" ? (
                  <DesktopDropdown label={item.name} links={item.links!} />
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center px-4 py-2 rounded-full text-[#4e5b6f] font-semibold text-[15px] hover:bg-primary/5 hover:text-[#3b82f6] transition-all duration-300 h-full"
                  >
                    {item.name}
                  </a>
                )}
                {/* Red dot separator only for dropdowns */}
                {item.type === "dropdown" && (
                  <span className="text-[#ff4f4f] font-bold text-[18px] leading-none mx-2 relative -top-[1px]">
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden xl:flex items-center space-x-6">
            {/* User Login */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-[42px] h-[42px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-[#3b82f6] transition-colors">
                <FiUser size={26} className="text-gray-300 mt-2" />
              </div>
              <a href="/login" className="text-[#4e5b6f] font-semibold text-[15px] group-hover:text-[#3b82f6] transition">
                Login
              </a>
            </div>

            {/* Join Now Button */}
            <a
              href="/register"
              className="border-[1.5px] border-[#3b82f6] text-[#3b82f6] px-6 py-2.5 rounded-md font-semibold text-[15px] hover:bg-[#3b82f6] hover:text-white transition duration-300 shadow-sm"
            >
              Join Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#3b82f6] focus:outline-none bg-gray-50 p-2 rounded-md"
            >
              {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white shadow-xl border-t border-gray-100 absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) =>
              item.type === "dropdown" ? (
                <MobileDropdown key={item.name} label={item.name} links={item.links!} />
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2.5 text-[#4e5b6f] hover:text-[#3b82f6] hover:bg-gray-50 rounded-md font-semibold"
                >
                  {item.name}
                </a>
              )
            )}

            {/* Mobile Auth & Cart */}
            <div className="border-t border-gray-100 mt-4 pt-5 space-y-5 px-3">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-3">
                  <div className="w-[42px] h-[42px] rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <FiUser size={26} className="text-gray-300 mt-2" />
                  </div>
                  <a href="/login" className="text-[#4e5b6f] font-semibold text-lg">
                    Login
                  </a>
                </div>
              </div>

              <a
                href="/register"
                className="block text-center border-2 border-[#3b82f6] bg-[#3b82f6] text-white px-4 py-3.5 rounded-lg font-bold shadow-md hover:bg-blue-600 transition w-full"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
