"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaAward, FaAmbulance } from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers className="text-4xl text-white" />,
    number: "25,000+",
    label: "Patients Served",
    color: "bg-blue-500",
  },
  {
    icon: <FaUserMd className="text-4xl text-white" />,
    number: "120+",
    label: "Specialist Doctors",
    color: "bg-secondary",
  },
  {
    icon: <FaAward className="text-4xl text-white" />,
    number: "18+",
    label: "Years of Service",
    color: "bg-tertiary",
  },
  {
    icon: <FaAmbulance className="text-4xl text-white" />,
    number: "24/7",
    label: "Emergency Support",
    color: "bg-red-500",
  },
];

const Statistics = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl"
            >
              <div className={`w-20 h-20 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-500 font-medium text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
