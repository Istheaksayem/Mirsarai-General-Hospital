import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

export const metadata = {
  title: 'Contact Us - Mirsarai General Hospital',
  description: 'Get in touch with Mirsarai General Hospital Baby Care & Diagnostic Center. We are here to help you 24/7.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
          Get In <span className="text-secondary">Touch</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          We are here to provide you with the best medical care. Reach out to us for any inquiries, appointments, or emergency assistance.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* Contact Information Cards */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-secondary pl-4">
              Contact Information
            </h2>
            
            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(30,43,122,0.1)] transition-all duration-300 border border-gray-100 flex items-start group">
              <div className="bg-primary/5 p-4 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 mr-6 mt-1">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Our Address</h3>
                
                <div className="space-y-4">
                  {/* Bengali Address */}
                  <div className="border-b border-gray-100 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-primary block text-[15px] mb-1">মীরসরাই জেনারেল হাসপাতাল বেবি কেয়ার এন্ড ডায়াগনস্টিক সেন্টার</strong>
                      ঠিকানা: থানার বিপরীতে, মীরসরাই পৌরসদর, চট্টগ্রাম।
                    </p>
                  </div>
                  
                  {/* English Address */}
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-primary block text-[15px] mb-1">Mirsarai General Hospital Baby Care & Diagnostic Center</strong>
                      Address: Opposite the Police Station, Mirsarai Pourosodor, Chittagong.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Hotline Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(118,188,33,0.1)] transition-all duration-300 border border-gray-100 flex items-start group">
              <div className="bg-secondary/10 p-4 rounded-full text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300 mr-6">
                <FaPhoneAlt className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">24/7 Hotline</h3>
                <p className="text-gray-600 text-lg font-medium">
                  01969-997799 <span className="text-gray-400 text-sm ml-2 font-normal">(English)</span>
                </p>
                <p className="text-gray-600 text-lg font-medium mt-1">
                  ০১৯৬৯-৯৯৭৭৯৯ <span className="text-gray-400 text-sm ml-2 font-normal">(বাংলা)</span>
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(0,188,212,0.1)] transition-all duration-300 border border-gray-100 flex items-start group">
              <div className="bg-tertiary/10 p-4 rounded-full text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors duration-300 mr-6">
                <FaEnvelope className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Email Address</h3>
                <a href="mailto:mirsaraigeneralhospital@gmail.com" className="text-gray-600 hover:text-tertiary transition-colors duration-300 break-all text-lg">
                  mirsaraigeneralhospital@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-50 relative overflow-hidden h-fit">
            {/* Decorative bg elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 relative z-10">
              Send us a Message
            </h2>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Send Message</span>
                <FaPaperPlane className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
