"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Reset email sent! Check your inbox 📩");
  };

  return (
    <main className="min-h-screen bg-[#646DE8] text-white flex flex-col">

      <header className="px-10 py-8">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Image src="/logo.png" alt="logo" width={22} height={22} />
          Flash
        </div>
      </header>

      <section className="flex-1 flex items-start justify-center pt-36 px-12">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-20 items-center">

          <div>
            <h1 className="text-7xl font-extrabold leading-tight">
              Simple to Use <br />
              Remember <br />
              Faster!
            </h1>

            <p className="mt-6 text-lg opacity-90">
              The best way to study!
            </p>
          </div>

          <div className="flex justify-center">
            <form
              onSubmit={handleReset}
              className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)] text-center flex flex-col gap-6"
            >

              <h2 className="text-3xl font-bold">
                Forgot Password?
              </h2>

              <p className="opacity-90">
                Enter your email to reset password
              </p>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white text-black rounded-xl px-5 py-3 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black py-4 rounded-xl font-semibold"
              >
                {loading ? "Sending..." : "Continue"}
              </button>

              <Link
                href="/login"
                className="text-sm underline opacity-90"
              >
                Back to Log In
              </Link>

            </form>
          </div>

        </div>
      </section>

    </main>
  );
}
