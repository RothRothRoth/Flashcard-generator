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

  const [collapsed, setCollapsed] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

    
  const handleSave = () => {
    if (!newName.trim()) return;

    setCourses([
      ...courses,
      {
        name: newName,
        time: "Just now",
      },
    ]);

    setNewName("");
    setCreating(false);
  };

   
  const handleDelete = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
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
            className="w-12 h-12 rounded-full bg-[#646DE8] shadow-md flex items-center justify-center"
          >
            <Image src="/profile.png" alt="profile" width={18} height={18} className="invert" />
          </button>

        </div>



         
        <div className="mt-8 flex items-center gap-4">
          <Image
              src="/course.png"
              alt="empty"
              width={36}
              height={36}
              className="brightness-0"
          />

          <h1 className="text-4xl font-bold text-[#646DE8]">Courses</h1>
        </div>

        <p className="text-gray-500 mt-2 text-sm">
          Total {courses.length}
        </p>



         
        <div className="mt-8 flex items-center justify-between">

          <div className="flex gap-3">

            {!creating && (
              <button
                onClick={() => setCreating(true)}
                className="bg-[#646DE8] text-white px-8 py-3 rounded-2xl flex items-center gap-2 shadow"
              >
                <Image src="/plus.png" alt="plus" width={14} height={14} />
                Create
              </button>
            )}

            {creating && (
              <>
                <button
                  onClick={() => {
                    setCreating(false);
                    setNewName("");
                  }}
                  className="bg-[#646DE8] text-white px-7 py-3 rounded-2xl flex items-center gap-2 shadow"
                >
                  <Image src="/x.png" alt="cancel" width={14} height={14} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-[#111827] text-white px-7 py-3 rounded-2xl flex items-center gap-2 shadow"
                >
                  <Image src="/check.png" alt="save" width={14} height={14} />
                  Save
                </button>
              </>
            )}

          </div>

          <div className="bg-white rounded-2xl px-5 py-3 shadow flex items-center gap-3 w-[260px]">
            <Image src="/search.png" alt="search" width={16} height={16} />
            <input
              placeholder="Search"
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>

        </div>



         
        <div className="mt-8 bg-gray-200 rounded-3xl p-8 h-[420px] overflow-y-auto shadow-xl">

          
          {creating && (
            <div className="bg-white rounded-3xl p-6 mb-6 shadow flex items-center gap-4">

              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Course Name</p>

                <div className="border rounded-xl px-4 py-2 flex items-center">
                  <input
                    placeholder="Enter course name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 outline-none bg-transparent"
                  />
                  <Image src="/edit.png" alt="edit" width={14} height={14} />
                </div>
              </div>

            </div>
          )}



           
          {courses.length === 0 && !creating && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <Image src="/course.png" alt="empty" width={64} height={64} />
              <p className="font-semibold text-lg">No courses yet</p>
              <p className="text-sm opacity-70">Create your first course 🚀</p>
            </div>
          )}



           
          <div className="space-y-6">

            {courses.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl px-8 py-6 shadow flex items-center"
              >

                
                <p className="flex-1 font-medium text-gray-800">
                  Course : {c.name}
                </p>

                 
                <div className="flex-1 flex justify-center">
                  <button className="bg-[#646DE8] text-white px-6 py-2 rounded-xl text-sm">
                    open
                  </button>
                </div>

                 
                <button onClick={() => handleDelete(i)}>
                  <Image src="/trash.png" alt="delete" width={18} height={18} />
                </button>

              </div>
            ))}

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
        <Item icon="/course.png" label="Courses" collapsed={collapsed} />
        <Item icon="/profile.png" label="Profile" collapsed={collapsed} onClick={() => router.push("/account")} />

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
    <div onClick={onClick} className="flex items-center gap-4 cursor-pointer">
      <Image src={icon} alt={label} width={18} height={18} />
      {!collapsed && label}
    </div>
  );
}
