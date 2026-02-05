"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();

  const [username, setUsername] = useState("Roth");
  const [email, setEmail] = useState("roth@email.com");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">

      <Sidebar onLogout={handleLogout} />

      <section className="flex-1 px-20 py-10">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:opacity-80"
          >
            <Image src="/arrow.png" alt="back" width={18} height={18} className="rotate-180" />
            Back
          </button>

          <button
            onClick={() => router.push("/account")}
            className="w-11 h-11 rounded-full bg-[#646DE8] flex items-center justify-center shadow"
          >
            <Image src="/profile.png" alt="profile" width={18} height={18} className="invert" />
          </button>

        </div>


        {/* TITLE */}
        <h1 className="text-3xl font-bold text-[#646DE8] mt-8">
          Account Settings
        </h1>


        {/* CARD */}
        <div className="mt-8 bg-gray-200 rounded-3xl p-12 shadow-xl flex gap-16">

          {/* LEFT FORM */}
          <div className="flex-1 space-y-8">

            <InputRow
              label="Username"
              value={username}
              onChange={setUsername}
            />

            <InputRow
              label="Email"
              value={email}
              onChange={setEmail}
            />

            <InputRow
              label="Password"
              value="********"
              type="password"
              disabled
            />

            <div className="flex gap-4 pt-4">
              <button className="bg-[#646DE8] text-white px-8 py-2 rounded-xl text-sm">
                Save
              </button>

              <button
                onClick={() => router.back()}
                className="bg-white text-gray-600 px-8 py-2 rounded-xl text-sm shadow"
              >
                Cancel
              </button>
            </div>

          </div>


          {/* RIGHT AVATAR */}
          <div className="flex flex-col items-center justify-center gap-4">

            <div className="w-32 h-32 rounded-full bg-white shadow flex items-center justify-center">
              <Image src="/user.png" alt="avatar" width={40} height={40} />
            </div>

            <p className="font-medium text-gray-700">{username}</p>

          </div>

        </div>

      </section>
    </main>
  );
}



function Sidebar({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-[#646DE8] text-white flex flex-col items-center py-12 px-6">

      <div className="flex flex-col items-center gap-3 mb-20">
        <Image src="/logo.png" alt="logo" width={36} height={36} />
        <span className="text-xl font-bold">Flash</span>
      </div>

      <nav className="flex flex-col gap-10 w-full text-sm">

        <SidebarItem icon="/home.png" label="Dashboard" onClick={() => router.push("/dashboard")} />
        <SidebarItem icon="/course.png" label="Courses" />
        <SidebarItem icon="/profile.png" label="Profile" />

      </nav>

      <button
        onClick={onLogout}
        className="mt-auto bg-white text-[#646DE8] rounded-2xl py-3 w-full flex items-center justify-center gap-3 text-sm font-semibold hover:scale-105 transition"
      >
        <Image src="/logout.png" alt="logout" width={16} height={16} />
        Logout
      </button>
    </aside>
  );
}



function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 cursor-pointer opacity-90 hover:opacity-100"
    >
      <Image src={icon} alt={label} width={18} height={18} />
      {label}
    </div>
  );
}



function InputRow({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm text-[#646DE8] font-medium">{label}</label>

      <div className="flex items-center border-b border-gray-400 pb-2 gap-3">

        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent flex-1 outline-none"
        />

        <Image src="/edit.png" alt="edit" width={16} height={16} />

      </div>

    </div>
  );
}
