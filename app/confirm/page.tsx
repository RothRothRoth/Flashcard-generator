"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Handle the email confirmation callback
    const handleEmailConfirmation = async () => {
      try {
        // Get the token from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken) {
          // Email is confirmed! Supabase handles this automatically
          setStatus("success");
        } else {
          // Check if user is already authenticated (might have been confirmed)
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email_confirmed_at) {
            setStatus("success");
          } else {
            setStatus("error");
            setErrorMessage("Invalid or expired confirmation link");
          }
        }
      } catch (error) {
        console.error("Confirmation error:", error);
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    };

    handleEmailConfirmation();
  }, []);

  // Loading state
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#646DE8] text-white flex flex-col">
        <header className="px-10 py-8">
          <div className="flex items-center gap-3 font-bold text-xl">
            <Image src="/logo.png" alt="logo" width={22} height={22} />
            Flash
          </div>
        </header>

        <section className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Confirming your email...</p>
          </div>
        </section>
      </main>
    );
  }

  // Error state
  if (status === "error") {
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
              <div className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)] text-center">
                <div className="w-28 h-28 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8">
                  <span className="text-6xl">✕</span>
                </div>

                <h2 className="text-2xl font-bold mb-3">
                  Confirmation Failed
                </h2>

                <p className="opacity-90 mb-8">
                  {errorMessage}
                </p>

                <Link
                  href="/signup"
                  className="bg-white text-black py-4 rounded-xl font-semibold block hover:bg-gray-100 transition"
                >
                  Back to Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Success state
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
            <div className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)] text-center">
              <Image
                src="/shield-check.png"
                alt="success"
                width={110}
                height={110}
                className="mx-auto mb-8"
              />

              <h2 className="text-2xl font-bold mb-3">
                Email Confirmed!
              </h2>

              <p className="opacity-90 mb-8">
                Your email has been verified successfully. You can now log in to your account.
              </p>

              <Link
                href="/login"
                className="bg-white text-black py-4 rounded-xl font-semibold block hover:bg-gray-100 transition"
              >
                Continue to Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}