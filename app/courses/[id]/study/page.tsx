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
  const [sessionStats, setSessionStats] = useState({ know: 0, dontKnow: 0 });
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

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
        
        // If there are no flashcards, redirect back
        if (!flashcardsData || flashcardsData.length === 0) {
          setTimeout(() => {
            router.back();
          }, 2000);
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

  const recordProgress = async (knowIt: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentCard = flashcards[currentCardIndex];

      // Check if progress record exists
      const { data: existing } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('flashcard_id', currentCard.id)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('flashcard_progress')
          .update({
            know_count: existing.know_count + (knowIt ? 1 : 0),
            dont_know_count: existing.dont_know_count + (knowIt ? 0 : 1),
            last_reviewed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('flashcard_progress')
          .insert({
            user_id: user.id,
            flashcard_id: currentCard.id,
            course_id: courseId,
            know_count: knowIt ? 1 : 0,
            dont_know_count: knowIt ? 0 : 1,
          });

        if (error) throw error;
      }

      // Update session stats
      setSessionStats(prev => ({
        know: prev.know + (knowIt ? 1 : 0),
        dontKnow: prev.dontKnow + (knowIt ? 0 : 1),
      }));

      // Show notification
      setNotification({
        type: 'success',
        message: knowIt ? '✓ Marked as known!' : '✗ Keep practicing!',
      });

      // Auto move to next card after a short delay
      setTimeout(() => {
        handleNext();
      }, 500);

    } catch (error) {
      console.error('Error recording progress:', error);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Finished all cards - show summary
      setNotification({
        type: 'info',
        message: `Session complete! Known: ${sessionStats.know}, Need practice: ${sessionStats.dontKnow}`,
      });
      setTimeout(() => {
        router.back();
      }, 3000);
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
      }, 2000);
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
  const masteryPercentage = sessionStats.know + sessionStats.dontKnow > 0
    ? Math.round((sessionStats.know / (sessionStats.know + sessionStats.dontKnow)) * 100)
    : 0;

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar collapsed={collapsed} onLogout={handleLogout} />
      
      <section className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* NOTIFICATION */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          } text-white font-medium animate-fade-in`}>
            {notification.message}
          </div>
        )}

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="bg-white shadow rounded-lg p-2"
            >
              <Image src="/menu.png" alt="menu" width={18} height={18} />
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-300 transition"
            >
              <Image src="/back.png" alt="back" width={16} height={16} />
              Back
            </button>
            <div className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium">
              Q.{currentCardIndex + 1}/{flashcards.length}
            </div>
            {/* SESSION STATS */}
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg font-medium">
              ✓ {sessionStats.know}
            </div>
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg font-medium">
              ✗ {sessionStats.dontKnow}
            </div>
            {sessionStats.know + sessionStats.dontKnow > 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2 rounded-lg font-medium">
                {masteryPercentage}% Mastery
              </div>
            )}
          </div>
          <button
            onClick={() => router.push("/account")}
            className="w-12 h-12 rounded-full bg-[#646DE8] shadow-md flex items-center justify-center hover:scale-105 transition"
          >
            <Image src="/profile.png" alt="profile" width={18} height={18} className="invert" />
          </button>
        </div>

        {/* STUDY CONTENT - CENTERED */}
        <div className="max-w-5xl mx-auto w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-3xl relative flex items-center justify-center gap-8">
            {/* LEFT NAVIGATION BUTTON */}
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className={`w-14 h-14 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center transition ${
                currentCardIndex === 0 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Image src="/left.png" alt="previous" width={24} height={24} />
            </button>
            
            {/* FLASHCARD CONTAINER */}
            <div className="flex-1 flex flex-col items-center gap-6">
              {/* FLASHCARD */}
              <div className="w-full bg-white rounded-3xl shadow-lg p-10">
                <div className="text-sm font-medium text-gray-600 mb-4">
                  {isFlipped ? 'Back' : 'Front'}
                </div>
                
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-12 min-h-[320px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-900">
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* BUTTONS ROW */}
              <div className="flex items-center gap-4">
                {/* I DON'T KNOW BUTTON */}
                {isFlipped && (
                  <button
                    onClick={() => recordProgress(false)}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition shadow-md flex items-center gap-2"
                  >
                    <span className="text-lg">✗</span>
                    I Don`t Know
                  </button>
                )}
                
                {/* FLIP BUTTON */}
                <button
                  onClick={handleFlip}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
                >
                  <Image src="/flip.png" alt="flip" width={18} height={18} />
                  Flip
                </button>
                
                {/* I KNOW BUTTON */}
                {isFlipped && (
                  <button
                    onClick={() => recordProgress(true)}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition shadow-md flex items-center gap-2"
                  >
                    <span className="text-lg">✓</span>
                    I Know
                  </button>
                )}
              </div>
            </div>
            
            {/* RIGHT NAVIGATION BUTTON */}
            <button
              onClick={handleNext}
              disabled={currentCardIndex === flashcards.length - 1}
              className={`w-14 h-14 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center transition ${
                currentCardIndex === flashcards.length - 1 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Image src="/right.png" alt="next" width={24} height={24} />
            </button>
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
        className="mt-auto bg-white text-[#646DE8] rounded-2xl py-3 w-full flex items-center justify-center gap-3 text-sm font-semibold hover:bg-gray-100 transition"
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
      className="flex items-center gap-4 cursor-pointer opacity-90 hover:opacity-100 transition"
    >
      <Image src={icon} alt={label} width={18} height={18} />
      {!collapsed && label}
    </div>
  );
}