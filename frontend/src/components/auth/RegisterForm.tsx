"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaTint, FaMapMarkerAlt } from "react-icons/fa";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { motion } from "framer-motion";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data: any) => {
    console.log("Register Data:", data);
    // TODO: Implement NextAuth registration
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-lg mx-auto max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-gray-500 font-medium">Join our hospital portal to access healthcare services.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <AuthInput
          label="Full Name"
          placeholder="Enter your full name"
          icon={<FaUser />}
          registration={register("fullName", { required: "Full name is required" })}
          error={errors.fullName?.message as string}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={<FaEnvelope />}
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message as string}
          />
          <AuthInput
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            icon={<FaPhone />}
            registration={register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\+?[0-9\s-]{7,15}$/,
                message: "Invalid phone number",
              },
            })}
            error={errors.phone?.message as string}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AuthInput
            label="Date of Birth"
            type="date"
            icon={<FaCalendarAlt />}
            registration={register("dob", { required: "Date of Birth is required" })}
            error={errors.dob?.message as string}
          />

          <div className="mb-5 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaVenusMars />
              </div>
              <select
                {...register("gender", { required: "Gender is required" })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.gender ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 bg-gray-50/50 hover:bg-white text-gray-800 transition-all appearance-none`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <PasswordInput
            label="Password"
            placeholder="Create password"
            registration={register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={errors.password?.message as string}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            registration={register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message as string}
          />
        </div>

        <div className="mb-5 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Blood Group</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-400">
              <FaTint />
            </div>
            <select
              {...register("bloodGroup", { required: "Blood group is required" })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.bloodGroup ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 bg-gray-50/50 hover:bg-white text-gray-800 transition-all appearance-none`}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          {errors.bloodGroup && <p className="mt-1 text-sm text-red-500">{errors.bloodGroup.message as string}</p>}
        </div>

        <div className="mb-6 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-400">
              <FaMapMarkerAlt />
            </div>
            <textarea
              placeholder="Enter your full address"
              rows={3}
              {...register("address", { required: "Address is required" })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.address ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 bg-gray-50/50 hover:bg-white text-gray-800 transition-all resize-none`}
            ></textarea>
          </div>
          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message as string}</p>}
        </div>

        <div className="mb-8">
          <label className="flex items-start text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 mr-3"
              {...register("terms", { required: "You must agree to the terms" })}
            />
            <span className="leading-tight">
              I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message as string}</p>}
        </div>

        <SubmitButton text="Create Account" />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
          </div>
        </div>

        <GoogleButton />
      </form>

      <p className="text-center mt-8 text-gray-600 font-medium pb-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
          Sign In
        </Link>
      </p>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </motion.div>
  );
};

export default RegisterForm;
