"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartments } from "@/hooks/useDepartments";
import * as FaIcons from "react-icons/fa6";
import * as FaIcons5 from "react-icons/fa";
import { FiSearch, FiChevronRight, FiUsers, FiCheckCircle } from "react-icons/fi";

// Helper to get icon
const getIcon = (iconName: string) => {
  const Icon6 = (FaIcons as any)[iconName];
  if (Icon6) return Icon6;
  const Icon5 = (FaIcons5 as any)[iconName];
  if (Icon5) return Icon5;
  return FaIcons5.FaHospital; // fallback
};

export default function DepartmentsPage() {
  const { data: departments, isLoading, error } = useDepartments();
  const [selectedDept, setSelectedDept] = useState<string | null>(null); // null means 'All Departments'
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !departments) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Failed to load departments data.</p>
      </div>
    );
  }

  // Filter departments by search
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDepartment = departments.find((d) => d.slug === selectedDept);

  return (
    <main className="min-h-screen bg-gray-50/30 pt-8 pb-20">
      {/* Header Banner */}
      <div className="bg-primary/5 py-12 mb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary">Departments</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Comprehensive medical care across various specialties, equipped with modern technology and experienced professionals.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Categories */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                Categories
              </h2>

              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>

              {/* Category List */}
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedDept(null)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedDept === null
                      ? "bg-primary text-white shadow-md shadow-primary/20 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FaIcons5.FaHospital size={18} />
                    All Departments
                  </span>
                  {selectedDept === null && <FiChevronRight size={18} />}
                </button>

                {departments.map((dept) => {
                  const Icon = getIcon(dept.icon);
                  const isSelected = selectedDept === dept.slug;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept.slug)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-primary text-white shadow-md shadow-primary/20 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} />
                        {dept.name}
                      </span>
                      {isSelected && <FiChevronRight size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              {selectedDept === null ? (
                /* Grid View */
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredDepartments.map((dept) => {
                    const Icon = getIcon(dept.icon);
                    return (
                      <div
                        key={dept.id}
                        onClick={() => setSelectedDept(dept.slug)}
                        className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {dept.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {dept.shortDescription}
                        </p>
                        <div className="flex items-center text-primary font-medium text-sm">
                          Explore Department <FiChevronRight className="ml-1" />
                        </div>
                      </div>
                    );
                  })}
                  {filteredDepartments.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                      No departments found matching your search.
                    </div>
                  )}
                </motion.div>
              ) : (
                /* Detail View */
                activeDepartment && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                  >
                    <div className="h-[300px] w-full relative overflow-hidden bg-gray-100">
                      {/* We can place an image here if it exists. Using a gradient as fallback */}
                      {activeDepartment.image ? (
                        <img
                          src={activeDepartment.image}
                          alt={activeDepartment.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center ${activeDepartment.image ? 'hidden' : ''}`}>
                         <h2 className="text-5xl font-bold text-white tracking-wider">{activeDepartment.name}</h2>
                      </div>
                    </div>

                    <div className="p-8 md:p-10">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                          {React.createElement(getIcon(activeDepartment.icon), { className: "text-primary" })}
                          {activeDepartment.name}
                        </h2>
                        {activeDepartment.available && (
                          <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Available Now
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {activeDepartment.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiUsers className="text-primary" /> Head of Department
                          </h3>
                          <p className="text-gray-700 font-medium text-lg">{activeDepartment.headDoctor}</p>
                          <p className="text-gray-500 text-sm mt-1">{activeDepartment.availableDoctors} Specialists Available</p>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Services</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeDepartment.services.map((service, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <FiCheckCircle className="text-secondary mt-1 flex-shrink-0" size={20} />
                            <span className="text-gray-700 font-medium">{service}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4">
                        <a 
                          href="/appointment"
                          className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 inline-block text-center"
                        >
                          Book Appointment
                        </a>
                        <a 
                          href="/doctors"
                          className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors inline-block text-center"
                        >
                          View Doctors
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
