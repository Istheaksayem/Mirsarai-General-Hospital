import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-[6px] border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="bg-white inline-block p-2 rounded-lg mb-6">
              <img src="/logo.png" alt="Hospital Logo" className="h-12 w-auto" />
            </div>
            <p className="text-gray-300 mb-6 font-light leading-relaxed">
              Committed to providing compassionate care and advanced medical solutions. Your health is our top priority.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-secondary inline-block">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-transform duration-300">Home</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-transform duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-transform duration-300">Services</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-transform duration-300">Our Doctors</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-transform duration-300">Appointments</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-1 inline-block transition-transform duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-secondary inline-block">Departments</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-secondary transition-colors duration-300">Cardiology</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-300">Neurology</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-300">Orthopedics</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-300">Pediatrics</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-300">General Surgery</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-300">Dental Care</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-secondary inline-block">Contact Info</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-secondary" />
                <span>123 Health Avenue, Medical District, City, Country</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-secondary" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-secondary" />
                <span>info@yourhospital.com</span>
              </li>
            </ul>
            <div className="mt-6 bg-white/10 p-4 rounded-lg border border-white/20">
              <p className="text-sm text-gray-300 mb-1">Emergency 24/7</p>
              <p className="text-xl font-bold text-secondary">+880 1234-567890</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Your Hospital Name. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
