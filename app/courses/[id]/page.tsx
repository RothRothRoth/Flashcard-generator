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
  const [isCreating, setIsCreating] = useState(false);
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
      setIsCreating(false);
      setNotification({ type: 'success', message: "Flashcard added successfully!" });
    } catch (error) {
      console.error('Error adding flashcard:', error);
      setNotification({ type: 'error', message: "Failed to add flashcard" });
    }
  };

  const handleDeleteFlashcard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this flashcard?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      // Update flashcards list
      setFlashcards(prev => prev.filter(card => card.id !== cardId));
      setNotification({ type: 'success', message: "Flashcard deleted successfully!" });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      setNotification({ type: 'error', message: "Failed to delete flashcard" });
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
              <button 
                 onClick={() => router.push(`/courses/${courseId}/study`)}
                   className="bg-[#111827] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#0e1420] transition"
                  >
                <Image src="/play.png" alt="study" width={16} height={16} />
                   Study
                </button>
                )}
            </div>
          </div>

          {/* ADD FLASHCARD BUTTONS - SAME LAYOUT AS COURSES PAGE */}
          <div className="flex gap-3 mb-6">
            {!isCreating && (
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-[#646DE8] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5a63d0] transition"
              >
                <span className="text-xs">+</span> Add Flashcard
              </button>
            )}
            
            {isCreating && (
              <>
                <button 
                  onClick={() => {
                    setIsCreating(false);
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

          {/* FLASHCARD CONTAINER - MATCHING REFERENCE IMAGE */}
          <div className="bg-[#F3F4F6] rounded-2xl p-4 max-h-[460px] overflow-y-auto">
            {flashcards.length === 0 && !isCreating ? (
              <div className="text-center py-8 text-gray-500">
                <p>No flashcards added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* NEW FLASHCARD FORM - ALWAYS AT THE TOP */}
                {isCreating && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">Q.New</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Front</label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px]">
                          <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter term or question..."
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Back</label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px]">
                          <input
                            type="text"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Enter definition or answer..."
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* EXISTING FLASHCARDS */}
                {flashcards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className="bg-white rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">Q.{index + 1}</span>
                        <button className="p-1">
                          <Image src="/edit.png" alt="edit" width={14} height={14} className="text-gray-500" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleDeleteFlashcard(card.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Image src="/trash.png" alt="delete" width={16} height={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Front</label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px]">
                          {card.question}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Back</label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[60px]">
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