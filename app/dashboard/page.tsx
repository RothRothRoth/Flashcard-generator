"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type Course = {
  name: string;
  time: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [courses] = useState<Course[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">

      <Sidebar collapsed={collapsed} onLogout={handleLogout} />

      <section className="flex-1 px-20 py-10">

        {/* TOP BAR (added collapse button only) */}
        <div className="flex items-center justify-between">

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-white shadow rounded-lg p-2"
          >
            <Image src="/menu.png" alt="menu" width={18} height={18} />
          </button>

          <button
            onClick={() => router.push("/account")}
            className="w-12 h-12 rounded-full bg-[#646DE8] shadow-md flex items-center justify-center hover:scale-105 transition"
          >
            <Image src="/profile.png" alt="profile" width={20} height={20} className="invert" />
          </button>

        </div>



        {/* HEADER CONTENT (unchanged) */}
        <div className="flex items-center gap-6 mt-6">

          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shadow">
            <Image src="/user.png" alt="user" width={26} height={26} />
          </div>

          <h1 className="text-4xl font-bold text-[#646DE8]">
            Welcome! Roth
          </h1>

        </div>



        <h2 className="mt-10 text-lg font-semibold text-gray-700">
          Ready to start learning?
        </h2>


        <button
          onClick={() => router.push("/courses")}
          className="mt-4 bg-[#646DE8] text-white px-10 py-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition"
        >
          Create course
          <Image src="/arrow.png" alt="arrow" width={16} height={16} />
        </button>


        <h3 className="mt-10 text-lg font-semibold text-gray-700">
          Recent Access
        </h3>


        <div className="mt-5 bg-gray-200 rounded-3xl p-8 h-[420px] overflow-y-auto shadow-xl">

          {courses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
              <p className="font-semibold">No courses yet</p>
              <p className="text-sm">Create your first course 🚀</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((c, i) => (
                <CourseCard key={i} name={c.name} time={c.time} />
              ))}
            </div>
          )}

        </div>

      </section>
    </main>
  );
}










/* SIDEBAR (same look, collapsible only) */

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

        <Item icon="/home.png" label="Dashboard" collapsed={collapsed} />

        <Item
          icon="/course.png"
          label="Courses"
          collapsed={collapsed}
          onClick={() => router.push("/courses")}
        />

        <Item
          icon="/profile.png"
          label="Profile"
          collapsed={collapsed}
          onClick={() => router.push("/account")}
        />

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





function CourseCard({ name, time }: Course) {
  return (
    <div className="bg-white rounded-3xl px-8 py-6 flex items-center justify-between shadow">
      <p className="font-medium text-gray-800">Course : {name}</p>
      <button className="bg-[#646DE8] text-white px-6 py-2 rounded-xl text-sm hover:scale-105 transition">
        open
      </button>
      <p className="text-gray-500 text-sm">Last access : {time}</p>
    </div>
  );
}
