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
      
      <section className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* TOP BAR - UNCHANGED POSITIONING */}
        <div className="flex items-center justify-between mb-6">
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

        {/* CONSTRAINED CONTENT CONTAINER */}
        <div className="max-w-4xl mx-auto w-full space-y-8">
          {/* WELCOME HEADER - SIMPLE CIRCLE ICON */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
              <Image src="/user.png" alt="user" width={28} height={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#646DE8]">Welcome! Roth</h1>
              <p className="text-gray-500 mt-1 text-sm">Let's continue your learning journey</p>
            </div>
          </div>

          {/* ACTION SECTION */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Ready to start learning?
            </h2>
            <button
              onClick={() => router.push("/courses")}
              className="bg-[#646DE8] text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-sm hover:bg-[#5a63d0] transition transform hover:scale-[1.02]"
            >
              Create course
              <Image src="/arrow.png" alt="arrow" width={16} height={16} />
            </button>
          </div>

          {/* RECENT ACCESS SECTION */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Recent Access
              </h3>
              {courses.length > 0 && (
                <span className="text-sm text-gray-500">{courses.length} course{courses.length > 1 ? 's' : ''}</span>
              )}
            </div>

            <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-5 h-[460px] overflow-y-auto shadow-sm">
              {courses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 py-8">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Image src="/course.png" alt="empty" width={28} height={28} className="opacity-70" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">No recent courses</p>
                    <p className="text-sm text-gray-400 mt-1">Create your first course to see it here</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((c, i) => (
                    <CourseCard key={i} name={c.name} time={c.time} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* SIDEBAR (unchanged functionality) */
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

/* COURSE CARD - MATCHES COURSES PAGE EXACTLY */
function CourseCard({ name, time }: Course) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-all">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">Course: {name}</p>
        <p className="text-xs text-gray-500 mt-0.5">Last accessed: {time}</p>
      </div>
      <div className="flex-shrink-0">
        <button className="bg-[#646DE8] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#5a63d0] transition shadow-sm min-w-[65px]">
          Open
        </button>
      </div>
    </div>
  );
}