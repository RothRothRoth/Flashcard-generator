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

export default function StudyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Extract course ID from URL
  const courseId = pathname.split('/')[2] || '';

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
          .order('created_at', { ascending: true });

        setFlashcards(flashcardsData || []);
        
        // If there are no flashcards, show notification
        if ((flashcardsData || []).length === 0) {
          setNotification({ type: 'error', message: "You need to add flashcards before studying" });
          setTimeout(() => {
            router.back();
          }, 3000);
        }
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

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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

  if (flashcards.length === 0) {
    return (
      <main className="min-h-screen flex bg-[#F6F7FB]">
        <Sidebar collapsed={collapsed} onLogout={handleLogout} />
        <section className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Flashcards Available</h2>
            <p className="text-gray-600 mb-6">You need to add flashcards before you can study</p>
            <button 
              onClick={handleBack}
              className="bg-[#646DE8] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5a63d0] transition"
            >
              Back to Course
            </button>
          </div>
        </section>
      </main>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar collapsed={collapsed} onLogout={handleLogout} />
      
      <section className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* TOP BAR - MATCHING REFERENCE IMAGE */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Image src="/back.png" alt="back" width={18} height={18} />
              Back
            </button>
            <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium">
              Q.{currentCardIndex + 1}
            </div>
          </div>
          <button
            onClick={() => router.push("/account")}
            className="w-12 h-12 rounded-full bg-[#646DE8] shadow-md flex items-center justify-center"
          >
            <Image src="/profile.png" alt="profile" width={18} height={18} className="invert" />
          </button>
        </div>

        {/* STUDY CONTENT - MATCHING REFERENCE IMAGE */}
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          <div className="w-full max-w-2xl relative">
            {/* LEFT NAVIGATION BUTTON */}
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className={`absolute left-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center transition ${currentCardIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <Image src="/left.png" alt="previous" width={20} height={20} />
            </button>
            
            {/* RIGHT NAVIGATION BUTTON */}
            <button
              onClick={handleNext}
              disabled={currentCardIndex === flashcards.length - 1}
              className={`absolute right-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center transition ${currentCardIndex === flashcards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <Image src="/right.png" alt="next" width={20} height={20} />
            </button>
            
            {/* FLASHCARD CARD */}
            <div className="bg-white rounded-2xl shadow-md p-8 mx-auto">
              <div className="text-sm font-medium text-gray-500 mb-3">Front</div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-800">{currentCard.question}</p>
                </div>
              </div>
            </div>
            
            {/* FLIP BUTTON - SEPARATE FROM FLASHCARD */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleFlip}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                <Image src="/flip.png" alt="flip" width={18} height={18} className="inline-block mr-2" />
                Flip
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// SIDEBAR COMPONENT - MATCHING DASHBOARD DESIGN
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

// ITEM COMPONENT
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