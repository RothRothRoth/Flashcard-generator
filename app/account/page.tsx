"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [username, setUsername] = useState("Roth");

  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setEmail(data.user.email);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">

      <Sidebar collapsed={collapsed} onLogout={handleLogout} />

      <section className="flex-1 px-20 py-10">

        <div className="flex items-center justify-between">

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-white shadow rounded-lg p-2"
          >
            <Image src="/menu.png" alt="menu" width={18} height={18} />
          </button>

          <button
            onClick={() => router.push("/account")}
            className="w-11 h-11 rounded-full bg-[#646DE8] flex items-center justify-center shadow"
          >
            <Image src="/profile.png" alt="profile" width={18} height={18} className="invert" />
          </button>

        </div>



        <h1 className="text-4xl font-bold text-[#646DE8] text-center mt-14">
          Account Settings
        </h1>



        <div className="flex justify-center mt-12">

          <div className="w-full max-w-5xl bg-gray-200 rounded-3xl p-14 shadow-xl flex items-center justify-between gap-20">

            <div className="flex-1 space-y-10">

              <div>
                <p className="text-sm text-[#646DE8] font-medium mb-2">Username</p>

                <div className="flex items-center gap-3 border-b border-gray-400 pb-2">
                  <input
                    value={username}
                    disabled={!editing}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                  />

                  <button onClick={() => setEditing(true)}>
                    <Image src="/edit.png" alt="edit" width={16} height={16} />
                  </button>
                </div>
              </div>



              <div>
                <p className="text-sm text-[#646DE8] font-medium mb-2">Email</p>

                <div className="border-b border-gray-400 pb-2">
                  <input
                    value={email}
                    disabled
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>



              <div>
                <p className="text-sm text-[#646DE8] font-medium mb-2">Password</p>
                <div className="border-b border-gray-400 pb-2 text-gray-600">
                  ********
                </div>
              </div>



              {editing && (
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-[#646DE8] text-white px-8 py-2 rounded-xl text-sm"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="bg-white px-8 py-2 rounded-xl text-sm shadow"
                  >
                    Cancel
                  </button>
                </div>
              )}

            </div>



            <div className="flex flex-col items-center gap-4">

              <div className="relative">

                <div className="w-32 h-32 rounded-full bg-white shadow flex items-center justify-center">
                  <Image src="/user.png" alt="avatar" width={40} height={40} />
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow"
                >
                  <Image src="/edit.png" alt="edit" width={12} height={12} />
                </button>

              </div>

              <p className="font-medium text-gray-700">{username}</p>

            </div>

          </div>
        </div>

      </section>
    </main>
  );
}








function Sidebar({
  collapsed,
  onLogout,
}: {
  collapsed: boolean;
  onLogout: () => void;
}) {
  const router = useRouter();

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-64"}
        bg-[#646DE8]
        text-white
        flex flex-col items-center py-12 px-6
        transition-all duration-300
      `}
    >

      <div className="flex flex-col items-center gap-3 mb-20">
        <Image src="/logo.png" alt="logo" width={36} height={36} />
        {!collapsed && <span className="text-xl font-bold">Flash</span>}
      </div>

      <nav className="flex flex-col gap-10 w-full text-sm">

        <Item icon="/home.png" label="Dashboard" collapsed={collapsed} onClick={() => router.push("/dashboard")} />
        <Item icon="/course.png" label="Courses" collapsed={collapsed} onClick={() => router.push("/courses")} />
        <Item icon="/profile.png" label="Profile" collapsed={collapsed} />

      </nav>

      <button
        onClick={onLogout}
        className="mt-auto bg-white text-[#646DE8] rounded-2xl py-3 w-full flex items-center justify-center gap-3 text-sm font-semibold"
      >
        <Image src="/logout.png" alt="logout" width={16} height={16} />
        {!collapsed && "Logout"}
      </button>

    </aside>
  );
}







function Item({
  icon,
  label,
  collapsed,
  onClick,
}: {
  icon: string;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 cursor-pointer opacity-90 hover:opacity-100"
    >
      <Image src={icon} alt={label} width={18} height={18} />
      {!collapsed && label}
    </div>
  );
}
