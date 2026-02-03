"use client";

import Image from "next/image";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">

      <Sidebar />

      <section className="flex-1 p-12">

        <Header />

        <h2 className="mt-8 text-xl font-semibold text-gray-700">
          Ready to start learning?
        </h2>

        <button className="mt-4 bg-[#646DE8] text-white px-8 py-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition">
          Create course
          <Image src="/icons/arrow.png" alt="arrow" width={18} height={18} />
        </button>

        <h3 className="mt-10 text-lg font-semibold text-gray-700">
          Recent Access
        </h3>

        <div className="mt-4 bg-gray-200/70 p-8 rounded-3xl space-y-6 max-h-[420px] overflow-y-auto">

          <CourseCard name="Algebra" time="1 hr" />
          <CourseCard name="Science" time="2 hrs" />

        </div>
      </section>
    </main>
  );
}







 

function Sidebar() {
  return (
    <aside className="w-64 bg-[#646DE8] text-white flex flex-col p-6">

       
      <div className="flex items-center gap-3 text-xl font-bold mb-12">
        <Image src="/logo.png" alt="logo" width={28} height={28} />
        Flash
      </div>

       
      <nav className="flex flex-col gap-8">

        <SidebarItem icon="/icons/home.png" label="Dashboard" active />
        <SidebarItem icon="/icons/book.png" label="Courses" />
        <SidebarItem icon="/icons/profile.png" label="Profile" />

      </nav>

       
      <button className="mt-auto bg-white text-[#646DE8] rounded-2xl py-4 flex items-center justify-center gap-3 font-semibold">
        <Image src="/icons/logout.png" alt="logout" width={18} height={18} />
        Logout
      </button>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 cursor-pointer ${
        active ? "opacity-100 font-semibold" : "opacity-80 hover:opacity-100"
      }`}
    >
      <Image src={icon} alt={label} width={20} height={20} />
      {label}
    </div>
  );
}






 

function Header() {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-6">
        <Image src="/icons/avatar.png" alt="avatar" width={70} height={70} />
        <h1 className="text-4xl font-bold text-[#646DE8]">
          Welcome! Roth
        </h1>
      </div>

      <Image src="/icons/profile.png" alt="profile" width={28} height={28} />
    </div>
  );
}







 

function CourseCard({
  name,
  time,
}: {
  name: string;
  time: string;
}) {
  return (
    <div className="bg-white rounded-3xl px-8 py-6 flex items-center justify-between shadow-sm">

      <p className="text-lg font-medium text-gray-800">
        Course : {name}
      </p>

      <button className="bg-[#646DE8] text-white px-6 py-2 rounded-xl">
        open
      </button>

      <p className="text-gray-500">
        Last access : {time}
      </p>
    </div>
  );
}
