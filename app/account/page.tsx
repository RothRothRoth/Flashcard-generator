"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [username, setUsername] = useState("Roth");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        
        // Fetch profile data including avatar
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUsername(profile.username || user.email?.split('@')[0] || "User");
          setAvatarUrl(profile.avatar_url);
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

   
  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      
       
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 🔍 DEBUG: Log critical info BEFORE validation
      console.log("=== UPLOAD DEBUG START ===");
      console.log("✅ Authenticated User ID:", user.id);
      console.log("📄 File Details:", {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        isValidType: file.type.startsWith('image/'),
        isValidSize: file.size <= 5 * 1024 * 1024
      });

        
      if (!file.type.startsWith('image/')) {
        console.log("❌ REJECTED: Not an image file");
        setNotification({ type: 'error', message: "Please upload an image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        console.log("❌ REJECTED: File too large (>5MB)");
        setNotification({ type: 'error', message: "File size too large. Max 5MB" });
        return;
      }

       
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
       
      const filePath = `avatars/${user.id}/${fileName}`;

      console.log("📤 Upload Path:", filePath);
      console.log("📦 Bucket: avatars");

       
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("❌ STORAGE UPLOAD FAILED:", uploadError);
        setNotification({ type: 'error', message: `Storage error: ${uploadError.message}` });
        return;
      }

      console.log("✅ Storage upload SUCCESS");

       
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log("🔗 Public URL:", publicUrl);

      // 🔍 CRITICAL DEBUG: Log BEFORE database update
      console.log("💾 Updating profiles table with:", {
        id: user.id,
        avatar_url: publicUrl
      });

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error("❌ DATABASE UPDATE FAILED:", updateError);
        console.error("💡 THIS IS THE CRITICAL ERROR - Check RLS policies on 'profiles' table!");
        setNotification({ 
          type: 'error', 
          message: `Database error: ${updateError.message.substring(0, 80)}...` 
        });
        return;
      }

      console.log("✅ Database update SUCCESS");
      console.log("=== UPLOAD DEBUG END ===");

      // Update state
      setAvatarUrl(publicUrl);
      setNotification({ type: 'success', message: "Profile picture updated successfully!" });
    } catch (error) {
      console.error('🔥 FATAL ERROR:', error);
      setNotification({ type: 'error', message: "Failed to upload profile picture" });
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  // Save username changes
  const handleSave = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setEditing(false);
      setNotification({ type: 'success', message: "Profile updated successfully!" });
    } catch (error) {
      console.error('Error saving profile:', error);
      setNotification({ type: 'error', message: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar collapsed={collapsed} onLogout={handleLogout} />

      <section className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* TOP BAR - EXACT MATCH TO YOUR DESIGN */}
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

        {/* NOTIFICATION BANNER */}
        {notification && (
          <div className={`max-w-4xl mx-auto mb-4 p-3 rounded-lg text-white font-medium text-center ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {notification.message}
          </div>
        )}

        {/* CENTERED CONTENT - MATCHING YOUR DESIGN */}
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-[#646DE8] text-center mb-8">
            Account Settings
          </h1>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              
              {/* LEFT COLUMN - FORM FIELDS (EMAIL ABOVE PASSWORD) */}
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <label className="block text-sm font-medium text-[#646DE8] mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      value={username}
                      disabled={!editing || loading}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#646DE8] focus:border-transparent"
                    />
                    {!editing && (
                      <button 
                        onClick={() => setEditing(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      >
                        <Image src="/edit.png" alt="edit" width={14} height={14} className="text-[#646DE8]" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#646DE8] mb-1">
                    Email Address
                  </label>
                  <input
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#646DE8] mb-1">
                    Password
                  </label>
                  <input
                    value="********"
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                {editing && (
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-[#646DE8] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#5a63d0] transition flex-1 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        // Reset to original username
                        const loadUser = async () => {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (user) {
                            const { data: profile } = await supabase
                              .from('profiles')
                              .select('username')
                              .eq('id', user.id)
                              .single();
                            if (profile) {
                              setUsername(profile.username || "");
                            }
                          }
                        };
                        loadUser();
                      }}
                      className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-300 transition flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - AVATAR */}
              <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                  {avatarUrl ? (
                    <Image 
                      src={avatarUrl} 
                      alt="avatar" 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src="/user.png" alt="avatar" width={32} height={32} />
                  )}
                </div>
                <p className="font-medium text-gray-700 text-lg">{username}</p>
                
                <div className="w-full max-w-[200px]">
                  <label 
                    htmlFor="avatar-upload" 
                    className="cursor-pointer block w-full"
                  >
                    <div className="flex items-center justify-center bg-[#646DE8] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a63d0] transition">
                      {uploading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        "Upload a picture"
                      )}
                    </div>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
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
        <Item icon="/course.png" label="Courses" collapsed={collapsed} onClick={() => router.push("/courses")} />
        <Item icon="/profile.png" label="Profile" collapsed={collapsed} />
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