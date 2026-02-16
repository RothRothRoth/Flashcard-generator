"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Password validation
const validatePassword = (password: string): string => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must contain uppercase letter";
  if (!/[a-z]/.test(password)) return "Must contain lowercase letter";
  if (!/\d/.test(password)) return "Must contain a number";
  return "";
};

// Username validation
const validateUsername = (username: string): string => {
  if (!username.trim()) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 30) return "Username must be under 30 characters";
  return "";
};

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before API call
    const unameError = validateUsername(username);
    const pwdError = validatePassword(password);
    setUsernameError(unameError);
    setPasswordError(pwdError);
    
    if (unameError !== "" || pwdError !== "") return;

    setLoading(true);
    try {
      // 🔥 STEP 1: Sign up the user with email redirect URL
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/confirm`, // Redirect to confirmation page
        },
      });

      if (signUpError) throw signUpError;

      // 🔥 STEP 2: Create profile in profiles table with username
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw error, user is already created
          // They can add username later in account settings
        }
      }

      // Clear form on success
      setUsername("");
      setEmail("");
      setPassword("");
      alert("Account created! Check your email to confirm your account.");
      router.push("/login");
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("weak_password")) {
        setPasswordError("Password doesn't meet security requirements");
      } else if (err.message.includes("email_exists")) {
        alert("Email already registered. Try logging in.");
      } else if (err.message.includes("username")) {
        setUsernameError("Username issue. Please try another.");
      } else {
        alert(`Signup failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Real-time username validation
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length > 0) {  
      setUsernameError(validateUsername(value));
    }
  };
 
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length > 0) {  
      setPasswordError(validatePassword(value));
    }
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
            <p className="mt-6 text-lg opacity-90">The best way to study!</p>
            <p className="mt-6 font-semibold">Good to see you!</p>
          </div>

          <div className="flex justify-center">
            <div className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <h2 className="text-3xl font-bold text-center mb-10">Welcome!</h2>

              <form onSubmit={handleSignup} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={() => setUsernameError(validateUsername(username))}
                    required
                    placeholder="Choose a username"
                    className={`bg-white text-black rounded-xl px-5 py-3 outline-none ${
                      usernameError ? "border-2 border-red-500" : ""
                    }`}
                  />
                  {usernameError && (
                    <p className="text-red-300 text-xs mt-1">{usernameError}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="bg-white text-black rounded-xl px-5 py-3 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => setPasswordError(validatePassword(password))}
                    required
                    placeholder="Create a strong password"
                    className={`bg-white text-black rounded-xl px-5 py-3 pr-12 outline-none ${
                      passwordError ? "border-2 border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] opacity-60 hover:opacity-100"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Image
                      src="/eye.png"
                      alt={showPassword ? "Hide password" : "Show password"}
                      width={20}
                      height={20}
                    />
                  </button>
                  {passwordError && (
                    <p className="text-red-300 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !!passwordError || !!usernameError}
                  className={`py-4 rounded-xl font-semibold mt-2 transition-opacity ${
                    loading || passwordError || usernameError
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="text-center text-sm opacity-90 mt-3">
                  Have an account?{" "}
                  <Link href="/login" className="underline font-medium hover:text-gray-200">
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