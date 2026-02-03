"use client";

import { useState } from "react";
import { Eye, EyeOff, Zap } from "lucide-react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex bg-indigo-500 text-white">
      {/* LEFT SIDE */}
      <section className="flex-1 flex flex-col justify-center px-20 max-lg:hidden">
        <div className="flex items-center gap-2 mb-12 text-xl font-bold">
          <Zap size={22} />
          Flash
        </div>

        <h1 className="text-6xl font-extrabold leading-tight mb-6">
          Simple to Use <br />
          Remember <br />
          Faster!
        </h1>

        <p className="text-lg opacity-90">The best way to study!</p>
        <p className="mt-4 font-semibold">Good to see you again!</p>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center mb-8">
            Welcome Back !
          </h2>

          {/* Email */}
          <label className="text-sm opacity-80">Email</label>
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full mt-2 mb-5 px-4 py-3 rounded-xl bg-white text-black outline-none"
          />

          {/* Password */}
          <label className="text-sm opacity-80">Password</label>
          <div className="relative mt-2 mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Remember Me
            </label>

            <a href="#" className="underline">
              forgot password
            </a>
          </div>

          {/* Button */}
          <button className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:scale-105 transition">
            Log In
          </button>

          {/* Signup */}
          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <span className="underline cursor-pointer">Sign Up</span>
          </p>
        </div>
      </section>
    </main>
  );
}
