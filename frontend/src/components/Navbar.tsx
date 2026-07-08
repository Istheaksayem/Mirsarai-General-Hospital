"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";

// ---- Dropdown data ----
const dropdownMenus = [
  {
    key: "doctors",
    label: "Doctors",
    links: [
      { name: "Doctor Directory", href: "/doctors" },
      { name: "Doctor Profiles", href: "/doctors/profiles" },
    ],
  },
  {
    key: "services",
    label: "Services",
    links: [
      { name: "Diagnostic Services", href: "/services/diagnostic" },
      { name: "NICU & Baby Care", href: "/services/nicu" },
    ],
  },
  {
    key: "about",
    label: "About",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Mission-Vision", href: "/about/mission-vision" },
    ],
  },
];

// ---- Plain nav links (no dropdown) ----
const plainLinks = [
  { name: "Home", href: "/" },
  { name: "Departments", href: "#" },
  { name: "Appointment", href: "/appointment" },
  { name: "Contact", href: "/contact" },
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
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-1 text-gray-700 hover:text-primary transition duration-300 font-medium">
        {label}
        <FiChevronDown
          size={15}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 transition duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>
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
        className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
      >
        {label}
        <FiChevronDown
          size={15}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <img className="h-10 w-auto" src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Home */}
            <a href="/" className="text-gray-700 hover:text-primary transition duration-300 font-medium">
              Home
            </a>

            {/* Dropdowns: Doctors, Services, About */}
            {dropdownMenus.map((menu) => (
              <DesktopDropdown key={menu.key} label={menu.label} links={menu.links} />
            ))}

            {/* Plain links */}
            {plainLinks
              .filter((l) => l.name !== "Home")
              .map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition duration-300 font-medium"
                >
                  {link.name}
                </a>
              ))}

            {/* Auth buttons */}
            <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
              <a
                href="/login"
                className="text-primary hover:text-primary/80 font-medium transition duration-300 px-2"
              >
                Login
              </a>
              <a
                href="/register"
                className="bg-secondary/10 text-secondary border border-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-full font-medium transition duration-300"
              >
                Register
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Home */}
            <a
              href="/"
              className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
            >
              Home
            </a>

            {/* Mobile Dropdowns: Doctors, Services, About */}
            {dropdownMenus.map((menu) => (
              <MobileDropdown key={menu.key} label={menu.label} links={menu.links} />
            ))}

            {/* Plain links */}
            {plainLinks
              .filter((l) => l.name !== "Home")
              .map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                >
                  {link.name}
                </a>
              ))}

            {/* Auth */}
            <div className="border-t border-gray-100 mt-2 pt-2 pb-2 space-y-2">
              <a
                href="/login"
                className="block px-3 py-2 text-primary hover:bg-primary/5 rounded-md font-medium"
              >
                Login
              </a>
              <a
                href="/register"
                className="block px-3 py-2 text-secondary hover:bg-secondary/5 rounded-md font-medium"
              >
                Register
              </a>
            </div>
            <button className="w-full text-left px-3 py-2 text-primary font-bold hover:bg-gray-50 rounded-md">
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
