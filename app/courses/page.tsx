"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

// Perfectly matches Supabase database structure
interface Course {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export default function CoursesPage() {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from('courses')
      .select('id, user_id, name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setCourses(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSave = async () => {
    if (!newName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data: newCourse } = await supabase
      .from('courses')
      .insert([{ 
        user_id: user.id, 
        name: newName 
      }])
      .select()
      .single();

    if (newCourse) {
      setCourses(prev => [newCourse, ...prev]);
      setNewName("");
      setCreating(false);
    }
  };

  const handleDelete = async (index: number) => {
    const courseToDelete = courses[index];
    
    if (!courseToDelete) return;

    await supabase
      .from('courses')
      .delete()
      .eq('id', courseToDelete.id);

    setCourses(courses.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar collapsed={collapsed} onLogout={handleLogout} />
      <section className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* TOP BAR - UNCHANGED POSITIONING (menu/profile at screen edges) */}
        <div className="flex items-center justify-between mb-6">
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

        {/* CONSTRAINED CONTENT CONTAINER - ONLY AFFECTS COURSES SECTION AND BELOW */}
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Image
                src="/course.png"
                alt="courses"
                width={28}
                height={28}
                className="brightness-0"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#646DE8]">Courses</h1>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!creating ? (
                <button
                  onClick={() => setCreating(true)}
                  className="bg-[#646DE8] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-[#5a63d0] transition"
                >
                  <Image src="/plus.png" alt="plus" width={14} height={14} />
                  Create Course
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewName("");
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-gray-300 transition"
                  >
                    <Image src="/x.png" alt="cancel" width={14} height={14} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-[#111827] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-[#0e1420] transition"
                  >
                    <Image src="/check.png" alt="save" width={14} height={14} />
                    Save
                  </button>
                </>
              )}
            </div>
            <div className="bg-white rounded-xl px-3.5 py-2 shadow-sm flex items-center gap-2 w-64 border border-gray-200">
              <Image src="/search.png" alt="search" width={16} height={16} className="opacity-70" />
              <input
                placeholder="Search courses"
                className="outline-none text-sm bg-transparent w-full placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 h-[460px] overflow-y-auto shadow-sm">
            {creating && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Course Name</p>
                <div className="flex gap-3">
                  <input
                    placeholder="Enter course name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 outline-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#646DE8] focus:border-transparent"
                  />
                  <button 
                    onClick={handleSave}
                    className="bg-[#646DE8] text-white px-5 rounded-lg flex items-center justify-center hover:bg-[#5a63d0] transition min-w-[80px] text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {courses.length === 0 && !creating && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 py-8">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Image src="/course.png" alt="empty" width={28} height={28} className="opacity-70" />
                </div>
                <p className="font-medium text-gray-600">No courses created yet</p>
                <p className="text-sm text-gray-400">Click "Create Course" to get started</p>
              </div>
            )}

            <div className="space-y-3">
              {courses.map((c, i) => (
                <div
                  key={c.id} 
                  className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">Course: {c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Created {new Date(c.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
<div className="flex items-center gap-6 flex-shrink-0">
  <button 
    onClick={() => router.push(`/courses/${c.id}`)}
    className="bg-[#646DE8] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#5a63d0] transition shadow-sm min-w-[65px]"
  >
    Open
  </button>
  <button 
    onClick={() => handleDelete(i)}
    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
    aria-label="Delete course"
  >
    <Image src="/trash.png" alt="delete" width={16} height={16} />
  </button>
</div>
                </div>
              ))}
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