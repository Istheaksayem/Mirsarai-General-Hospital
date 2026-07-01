"use client";

import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "#" },
    { name: "Services", href: "#" },
    { name: "Departments", href: "#" },
    { name: "Appointment", href: "#" },
    { name: "Contact", href: "#" },
  ];

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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary transition duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
              <a href="/login" className="text-primary hover:text-primary/80 font-medium transition duration-300 px-2">
                Login
              </a>
              <a href="/register" className="bg-secondary/10 text-secondary border border-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-full font-medium transition duration-300">
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 pb-2 space-y-2">
              <a href="/login" className="block px-3 py-2 text-primary hover:bg-primary/5 rounded-md font-medium">
                Login
              </a>
              <a href="/register" className="block px-3 py-2 text-secondary hover:bg-secondary/5 rounded-md font-medium">
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
