import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeartbeat, FaArrowRight } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-primary text-white pt-20 pb-10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-[30px] md:h-[60px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background"
          ></path>
        </svg>
      </div>

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-tertiary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 md:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & About (Spans 4 columns) */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 backdrop-blur-sm inline-block p-3 rounded-xl mb-6 shadow-lg shadow-black/10 border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <img src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" className="h-14 w-auto rounded-md" />
            </div>
            <p className="text-gray-300 mb-8 font-light leading-relaxed text-sm pr-4">
              Committed to providing compassionate care and advanced medical solutions. We combine state-of-the-art technology with human empathy, because your health is our top priority.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/mirsaraigeneralhospital" className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:shadow-[0_0_15px_rgba(118,188,33,0.5)] transition-all duration-300">
                <FaFacebookF className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-tertiary hover:border-tertiary hover:shadow-[0_0_15px_rgba(0,188,212,0.5)] transition-all duration-300">
                <FaTwitter className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300">
                <FaInstagram className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300">
                <FaLinkedinIn className="text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Links (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-[2px] bg-secondary mr-3 rounded-full"></span>
              Explore
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '#' },
                { name: 'Services', href: '#' },
                { name: 'Our Doctors', href: '#' },
                { name: 'Appointments', href: '#' },
                { name: 'Contact Us', href: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="group flex items-center hover:text-secondary transition-colors duration-300">
                    <FaArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-secondary text-xs mr-2 transition-all duration-300" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-[2px] bg-tertiary mr-3 rounded-full"></span>
              Departments
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery', 'Dental Care'].map((dept) => (
                <li key={dept}>
                  <a href="#" className="group flex items-center hover:text-tertiary transition-colors duration-300">
                    <FaArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-tertiary text-xs mr-2 transition-all duration-300" />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">{dept}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Emergency (Spans 4 columns) */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-[2px] bg-gradient-to-r from-secondary to-tertiary mr-3 rounded-full"></span>
              Get In Touch
            </h3>
            
            <ul className="space-y-4 text-sm text-gray-300 mb-8">
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-2 rounded-full bg-white/5 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <FaMapMarkerAlt size={14} />
                </div>
                <span className="leading-relaxed">
                  <strong className="text-white block mb-1">Mirsharai General Hospital</strong>
                  Opposite the Police Station, Mirsharai Pouroshodor, Chittagong.
                </span>
              </li>
              <li className="flex items-center group">
                <div className="mr-4 p-2 rounded-full bg-white/5 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all duration-300">
                  <FaPhoneAlt size={14} />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">+8801969-997799</span>
              </li>
              <li className="flex items-center group">
                <div className="mr-4 p-2 rounded-full bg-white/5 text-pink-400 group-hover:bg-pink-400 group-hover:text-white transition-all duration-300">
                  <FaEnvelope size={14} />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">mirsaraigeneralhospital@gmail.com</span>
              </li>
            </ul>

            {/* Emergency Glass Card */}
            <div className="relative group overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-secondary/50 transition-all duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-secondary/40 transition-colors duration-500"></div>
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-secondary/30 animate-pulse">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">24/7 Emergency</p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-secondary transition-colors duration-300">+01969-997799</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter & Copyright Separator */}
        <div className="border-t border-white/10 pt-8 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center lg:text-left order-2 lg:order-1">
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">Mirsharai General Hospital</span>. All Rights Reserved.
            </p>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm text-gray-400 order-1 lg:order-2">
              <a href="/privacy" className="hover:text-secondary transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Privacy Policy</a>
              <a href="/terms" className="hover:text-tertiary transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-tertiary hover:after:w-full after:transition-all after:duration-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

