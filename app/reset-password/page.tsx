"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/password-success");
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
              onSubmit={handleUpdate}
              className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)] flex flex-col gap-6"
            >

              <h2 className="text-3xl font-bold text-center">
                Change Password
              </h2>

              <p className="text-center text-sm opacity-80">
                Your password must be at least 8 characters
              </p>

              {/* New password */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm">New Password</label>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="new password"
                  required
                  className="bg-white text-black rounded-xl px-5 py-3 pr-12 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] opacity-60 hover:opacity-100"
                >
                  <Image
                    src="/eye.png"
                    alt="toggle"
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm">Confirm Password</label>

                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="confirm password"
                  required
                  className="bg-white text-black rounded-xl px-5 py-3 pr-12 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-[42px] opacity-60 hover:opacity-100"
                >
                  <Image
                    src="/eye.png"
                    alt="toggle"
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black py-4 rounded-xl font-semibold mt-4"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

            </form>

          </div>
        </div>
      </section>
    </main>
  );
}
