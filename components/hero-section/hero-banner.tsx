"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const HeroBanner = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#c8e6c9] to-[#b3ddb6] overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern
              id="techPattern"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="200"
                y2="200"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="200"
                y1="0"
                x2="0"
                y2="200"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#techPattern)" />
        </svg>
      </div>

      <div className="relative  z-10 container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="min-h-[600px] space-y-8">
          {/* Left Section - Headline */}

          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-[#28a745]">
              Professional Tax <br /> Services in Bangladesh
            </h1>
            <p className="text-lg text-slate-700 font-medium text-center max-w-xl mx-auto">
              Simplifying tax compliance for individuals and businesses with
              expert guidance and modern digital tools.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex  items-center relative h-full w-full">
              <div className="relative w-full max-w-md">
                <div className="relative z-20 transform -rotate-2">
                  <div className="bg-black rounded-2xl shadow-2xl border-8 border-black overflow-hidden">
                    <div className="bg-white aspect-video flex items-center justify-center">
                      <div className="text-center text-sm text-slate-400 p-4">
                        <p className="font-semibold mb-2">BD Tax Dashboard</p>
                        <p className="text-xs">Smart Tax Software Interface</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-20 h-2 bg-black rounded-full opacity-50" />
                </div>

                <div className="absolute -left-12 top-8 z-30 transform rotate-12">
                  <div className="bg-black rounded-3xl shadow-2xl border-8 border-black overflow-hidden w-32 aspect-[9/16]">
                    <div className="bg-white h-full flex items-center justify-center">
                      <div className="text-center text-xs text-slate-400 p-2">
                        <p className="font-semibold">Mobile App</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full max-w-md">
                <p className="text-slate-600 mb-6 font-medium">
                  Hassle-free tax season starts here
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password *"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:bg-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-slate-300 cursor-pointer accent-[#28a745]"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>

                {/* Sign In Button */}
                <button className="w-full bg-[#28a745] hover:bg-[#1f7a33] text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4">
                  Sign In
                </button>

                {/* Footer Links */}
                <p className="text-center text-xs text-slate-600 mb-4">
                  By clicking Sign In, you accept the{" "}
                  <Link
                    href="#"
                    className="text-[#28a745] hover:underline font-semibold"
                  >
                    Terms of service
                  </Link>
                </p>

                <p className="text-center text-sm text-slate-700 mb-4">
                  New to BDTax?{" "}
                  <Link
                    href="#"
                    className="text-[#28a745] hover:underline font-semibold"
                  >
                    Create Account
                  </Link>
                </p>

                <p className="text-center mb-6">
                  <Link
                    href="#"
                    className="text-[#28a745] hover:underline text-sm font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
