"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // saves extra info in Supabase user metadata
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! You can now log in.");
    router.push("/login");
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

            <p className="mt-6 font-semibold">
              Good to see you!
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">

              <h2 className="text-3xl font-bold text-center mb-10">
                Welcome !
              </h2>

              <form onSubmit={handleSignup} className="flex flex-col gap-6">

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Username</label>


                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Username"
                    className="bg-white text-black rounded-xl px-5 py-3 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Email</label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="bg-white text-black rounded-xl px-5 py-3 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm">Password</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="bg-white text-black rounded-xl px-5 py-3 pr-12 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] opacity-60 hover:opacity-100"
                  >
                    <Image
                      src="/eye.png"
                      alt="toggle password"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black py-4 rounded-xl font-semibold mt-2"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-center text-sm opacity-90 mt-3">
                  Have an account?{" "}
                  <Link href="/login" className="underline font-medium">
                    Log In
                  </Link>
                </p>

              </form>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
