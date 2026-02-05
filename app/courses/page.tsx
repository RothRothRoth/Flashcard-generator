"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type Course = {
  name: string;
  time: string;
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses] = useState<Course[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">

      <Sidebar onLogout={handleLogout} />

      <section className="flex-1 px-20 py-10">

        <Header />

         
        <div className="mt-8 flex items-center gap-4">
          <Image
            src="/course.png"
            alt="course"
            width={32}
            height={32}
            className="brightness-0 saturate-100 invert-[43%] sepia-[83%] saturate-[600%] hue-rotate-[215deg]"
         />

          <h1 className="text-4xl font-bold text-[#646DE8]">Courses</h1>
        </div>

        <p className="text-gray-500 mt-2 text-sm">
          Total {courses.length}
        </p>

         
        <div className="mt-8 flex items-center justify-between">

          <button
            onClick={() => router.push("/courses/create")}
            className="bg-[#646DE8] text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition shadow"
          >
            <Image src="/plus.png" alt="plus" width={14} height={14} />
            Create
          </button>

          
          <div className="bg-white rounded-2xl px-5 py-3 shadow flex items-center gap-3 w-[260px]">
            <Image src="/search.png" alt="search" width={16} height={16} />
            <input
              placeholder="Search"
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>

        </div>

         
        <div className="mt-8 bg-gray-200 rounded-3xl p-8 h-[420px] overflow-y-auto shadow-xl">

          {courses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">

              <Image src="/course.png" alt="empty" width={64} height={64} />

              <p className="font-semibold text-lg">
                No courses yet
              </p>

              <p className="text-sm opacity-70">
                Create your first course 🚀
              </p>

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
        <SidebarItem icon="/profile.png" label="Profile" onClick={() => router.push("/account")} />

      </nav>

      <button
        onClick={onLogout}
        className="mt-auto bg-white text-[#646DE8] rounded-2xl py-3 w-full flex items-center justify-center gap-3 font-semibold hover:scale-105 transition"
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












function Header() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end">

      <button
        onClick={() => router.push("/account")}
        className="w-12 h-12 rounded-full bg-[#646DE8] shadow-md flex items-center justify-center hover:scale-105 transition"
      >
        <Image
          src="/profile.png"
          alt="profile"
          width={18}
          height={18}
          className="invert"
        />
      </button>

    </div>
  );
}











function CourseCard({ name, time }: Course) {
  return (
    <div className="bg-white rounded-3xl px-8 py-6 flex items-center justify-between shadow">

      <p className="font-medium text-gray-800">
        Course : {name}
      </p>

      <button className="bg-[#646DE8] text-white px-6 py-2 rounded-xl text-sm hover:scale-105 transition">
        open
      </button>

      <p className="text-gray-500 text-sm">
        Last access : {time}
      </p>
    </div>
  );
}
