"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface Course {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

interface Flashcard {
  id: string;
  course_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export default function CoursePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [editing, setEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Extract course ID from URL
  const courseId = pathname.split('/').pop() || '';

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Get course data
        const { data: courseData } = await supabase
          .from('courses')
          .select('id, name, created_at')
          .eq('id', courseId)
          .eq('user_id', user.id)
          .single();

        if (!courseData) {
          router.push("/courses");
          return;
        }

        setCourse(courseData);

        // Get flashcards for this course
        const { data: flashcardsData } = await supabase
          .from('flashcards')
          .select('id, question, answer, created_at')
          .eq('course_id', courseId)
          .order('created_at', { ascending: false });

        setFlashcards(flashcardsData || []);
      } catch (err) {
        console.error(err);
        router.push("/courses");
      }
    };

    loadCourse();
  }, [courseId, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAddFlashcard = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setNotification({ type: 'error', message: "Both question and answer are required" });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: newCard } = await supabase
        .from('flashcards')
        .insert([{
          course_id: courseId,
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
          user_id: user.id
        }])
        .select()
        .single();

      // Update flashcards list
      setFlashcards(prev => [newCard, ...prev]);
      setNewQuestion("");
      setNewAnswer("");
      setEditing(false);
      setNotification({ type: 'success', message: "Flashcard added successfully!" });
    } catch (error) {
      console.error('Error adding flashcard:', error);
      setNotification({ type: 'error', message: "Failed to add flashcard" });
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar collapsed={collapsed} onLogout={handleLogout} />
      
      <section className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* TOP BAR - EXACTLY MATCHES COURSES PAGE */}
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

        {/* CENTERED CONTENT - EXACTLY MATCHES COURSES PAGE WIDTH */}
        <div className="max-w-4xl mx-auto w-full">
          {/* COURSE HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-white rounded-xl p-2 border border-gray-200">
                <Image src="/course.png" alt="course" width={28} height={28} className="brightness-0" />
              </div>
              <h1 className="text-3xl font-bold text-[#646DE8]">Course: Algebra</h1>
            </div>
            <p className="text-gray-500">{flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'}</p>
          </div>

          {/* WELCOME MESSAGE - SAME AS COURSES PAGE */}
          <div className="bg-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Let's Start Learning Algebra!</p>
              {flashcards.length > 0 && (
                <button className="bg-[#111827] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#0e1420] transition">
                  <Image src="/play.png" alt="study" width={16} height={16} />
                  Study
                </button>
              )}
            </div>
          </div>

          {/* ADD FLASHCARD BUTTONS - SAME LAYOUT AS COURSES PAGE */}
          <div className="flex gap-3 mb-6">
            {!editing && (
              <button 
                onClick={() => setEditing(true)}
                className="bg-[#646DE8] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5a63d0] transition"
              >
                <span className="text-xs">+</span> Add Flashcard
              </button>
            )}
            
            {editing && (
              <>
                <button 
                  onClick={() => {
                    setEditing(false);
                    setNewQuestion("");
                    setNewAnswer("");
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddFlashcard}
                  disabled={!newQuestion.trim() || !newAnswer.trim()}
                  className="bg-[#646DE8] text-white px-4 py-2 rounded-lg hover:bg-[#5a63d0] transition disabled:opacity-50"
                >
                  Save
                </button>
              </>
            )}
          </div>

          {/* FLASHCARD CONTAINER - SAME PROPORTIONS AS COURSES LIST */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {flashcards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No flashcards added yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-4">
                {flashcards.map((card, index) => (
                  <div key={card.id} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-lg">Q.{index + 1}</span>
                        <button className="p-1">
                          <Image src="/edit.png" alt="edit" width={14} height={14} className="text-gray-500" />
                        </button>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Image src="/trash.png" alt="delete" width={16} height={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Front</label>
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                          {card.question}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Back</label>
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                          {card.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// SIDEBAR COMPONENT
function Sidebar({ 
  collapsed, 
  onLogout 
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
        <Item 
          icon="/home.png" 
          label="Dashboard" 
          collapsed={collapsed} 
          onClick={() => router.push("/dashboard")} 
        />
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