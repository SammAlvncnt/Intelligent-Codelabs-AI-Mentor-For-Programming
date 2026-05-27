import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Challenge, EvaluationResult } from "./types";
import { challenges as defaultChallenges } from "./challenges";
import { LeftPanel } from "./components/LeftPanel";
import { MiddlePanel } from "./components/MiddlePanel";
import { RightPanel } from "./components/RightPanel";
import { 
  Terminal, Sparkles, Code2, Cpu, HelpCircle, 
  X, CheckCircle, Smartphone, Laptop, Menu, Layers, Award,
  Sun, Moon, ArrowRight, BookOpen, Clock, Heart, ShieldAlert, Zap,
  Play, CheckCircle2, AlertCircle, RefreshCw, Star, Braces, Database,
  ChevronDown, LogOut, User as UserIcon
} from "lucide-react";
import { LoginView } from "./components/LoginView";
import { RegisterView } from "./components/RegisterView";
import { auth, onAuthStateChanged, signOut } from "./firebase";

// Custom client-side router Link component matching standard react-router-dom Link behavior
function Link({ to, children, className, id }: { to: string; children: React.ReactNode; className?: string; id?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return (
    <a href={to} onClick={handleClick} className={className} id={id}>
      {children}
    </a>
  );
}

const fadeInRise = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

export default function App() {
  // --- States ---
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("intelligent_codelabs_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });
  const [activePage, setActivePage] = useState<"landing" | "dashboard" | "login" | "register">("landing");
  const [user, setUser] = useState<any>(null);
  const [userState, setUserState] = useState<any>(null);

  const [activeChallenge, setActiveChallenge] = useState<Challenge>(defaultChallenges[0]);
  const challenges = defaultChallenges.filter(c => c.technology === activeChallenge.technology);
  const [code, setCode] = useState<string>("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Custom states for interactive info overlay
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Mobile responsive tabs: "materi", "editor", "progress"
  const [mobileTab, setMobileTab] = useState<"materi" | "editor" | "progress">("editor");

  // --- Dropdown Navigation State & Data ---
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside detector for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    {
      title: "Frontend & Web Core",
      color: "text-amber-500",
      items: [
        { name: "JavaScript", icon: "🟨" },
        { name: "TypeScript", icon: "🟦" },
        { name: "React", icon: "⚛️" },
        { name: "Vue", icon: "💚" },
        { name: "Next.js", icon: "⚫" },
        { name: "Svelte", icon: "🔥" }
      ]
    },
    {
      title: "Backend & Systems",
      color: "text-sky-500",
      items: [
        { name: "Python", icon: "🐍" },
        { name: "Go", icon: "🐹" },
        { name: "Rust", icon: "🦀" },
        { name: "C++", icon: "👾" },
        { name: "Java", icon: "☕" },
        { name: "Ruby", icon: "💎" },
        { name: "PHP", icon: "🐘" }
      ]
    },
    {
      title: "Mobile, Frameworks & DB",
      color: "text-emerald-555",
      items: [
        { name: "Swift", icon: "🦅" },
        { name: "Kotlin", icon: "🤖" },
        { name: "SQL SELECT Basic", icon: "📊" },
        { name: "SQL Joins & Group", icon: "🔗" },
        { name: "Express.js", icon: "🚀" },
        { name: "Laravel", icon: "🟥" },
        { name: "Django", icon: "💚" }
      ]
    }
  ];

  const dropdownTechnologies = categories.flatMap(cat => cat.items);

  // --- Client-Side Route helper to technology ---
  const routeToTechnology = (techName: string) => {
    const found = defaultChallenges.find(
      c => c.technology.toLowerCase() === techName.toLowerCase()
    );
    if (found) {
      handleSelectChallenge(found);
    }
    setActivePage("dashboard");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // --- Theme Syncer ---
  useEffect(() => {
    localStorage.setItem("intelligent_codelabs_theme", theme);
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [theme]);

  // Synchronize challenge selection with user status state on login or reload
  const matchChallengeToState = (state: any) => {
    if (!state) return;
    const { currentLanguage, currentSubBabIndex } = state;
    const filtered = defaultChallenges.filter(c => 
      c.technology.toLowerCase() === currentLanguage.toLowerCase()
    );
    if (filtered.length > 0) {
      const idx = currentSubBabIndex < filtered.length ? currentSubBabIndex : filtered.length - 1;
      const ch = filtered[idx] || filtered[0];
      setActiveChallenge(ch);
      loadChallengeDraft(ch.id, ch.boilerplate);
    }
  };

  // --- Client Routing Listener ---
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === "/login") {
        setActivePage("login");
      } else if (path === "/register") {
        setActivePage("register");
      } else if (path === "/dashboard") {
        setActivePage("dashboard");
      } else {
        setActivePage("landing");
      }
    };
    
    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // --- Firebase Auth & State Sync Listener (Persistent Signin) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const syncResponse = await fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            })
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            setUser(syncData.user);
            setUserState(syncData.state);
            matchChallengeToState(syncData.state);
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Siswa Codelabs",
              photoURL: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            });
          }
        } catch (e) {
          console.error("Gagal sinkron profile saat onAuthStateChanged:", e);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "Siswa Codelabs",
            photoURL: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          });
        }
      } else {
        setUser(null);
        setUserState(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Initial Mount Load ---
  useEffect(() => {
    // 1. Load completed challenge IDs from localStorage
    const savedCompleted = localStorage.getItem("intelligent_codelabs_completed");
    if (savedCompleted) {
      try {
        setCompletedIds(JSON.parse(savedCompleted));
      } catch (err) {
        console.error("Gagal membaca progress tersimpan", err);
      }
    }

    // 2. Load draft code for initial active challenge
    loadChallengeDraft(defaultChallenges[0].id, defaultChallenges[0].boilerplate);
  }, []);

  // --- Helper to Load Code Draft ---
  const loadChallengeDraft = (challengeId: string, fallbackBoilerplate: string) => {
    const savedDraft = localStorage.getItem(`codelab_draft_${challengeId}`);
    if (savedDraft) {
      setCode(savedDraft);
    } else {
      setCode(fallbackBoilerplate);
    }
    // Clear previous feedback logs when switching challenges
    setEvaluation(null);
  };

  // --- Watch and Save Code Drafts ---
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    localStorage.setItem(`codelab_draft_${activeChallenge.id}`, newCode);
  };

  // --- Switch Challenge Handler ---
  const handleSelectChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    loadChallengeDraft(challenge.id, challenge.boilerplate);
    // On mobile, auto slide tab to editor to immediately code
    setMobileTab("editor");
  };

  // --- Reset Code Handler ---
  const handleResetCode = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang kode Anda ke boilerplate standar?")) {
      setCode(activeChallenge.boilerplate);
      localStorage.removeItem(`codelab_draft_${activeChallenge.id}`);
      setEvaluation(null);
    }
  };

  // --- Submit Code for Server-Side AI Evaluation ---
  const handleSubmitCode = async () => {
    setSubmitting(true);
    setEvaluation(null);

    // Initial log messages
    const prepLogs = {
      success: false,
      stdout: "[System] Memulai kompilasi kode tantangan...",
      logs: [
        "[System] Mengirimkan muatan solusi ke Server AI...",
        "[System] Memeriksa sintaks penulisan...",
        "[System] Menguji kasus uji...",
        "[AI Tutor] Menganalisis optimasi program..."
      ],
      feedback: "Mengevaluasi...",
      error: null
    };
    setEvaluation(prepLogs);

    try {
      // Determine endpoint based on whether the user is logged in
      const endpoint = user ? "/api/quiz/submit" : "/api/submit";
      const payload = user 
        ? { userId: user.uid, teknologi: activeChallenge.technology, userCode: code }
        : { challengeId: activeChallenge.id, code };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }

      const rawData = await response.json();
      
      // Map Response
      let mappedData: EvaluationResult;
      if (user) {
        const isCorrect = rawData.evaluasi.apakah_benar === true;
        const rawLogs = rawData.evaluasi.logs;
        let logsArray: string[] = [];
        if (Array.isArray(rawLogs)) {
          logsArray = rawLogs;
        } else if (typeof rawLogs === "string") {
          logsArray = rawLogs.split("\n").filter(Boolean);
        } else {
          logsArray = [
            `[System] Server-side evaluation complete.`,
            isCorrect ? `[SUCCESS] Solusi Anda dinilai benar!` : `[FAILED] Kriteria belum terpenuhi.`
          ];
        }

        mappedData = {
          success: isCorrect,
          stdout: isCorrect ? "[SUKSES] Semua pengujian berhasil dijalankan!" : "[GAGAL] Solusi Anda belum memenuhi kriteria.",
          logs: logsArray,
          feedback: rawData.evaluasi.feedback,
          error: null
        };
        
        // Update userState sub-chapter index from server
        setUserState((prev: any) => prev ? { ...prev, currentSubBabIndex: rawData.currentSubBabIndex } : null);
      } else {
        const rawLogs = rawData.logs;
        let logsArray: string[] = [];
        if (Array.isArray(rawLogs)) {
          logsArray = rawLogs;
        } else if (typeof rawLogs === "string") {
          logsArray = rawLogs.split("\n").filter(Boolean);
        } else {
          logsArray = [
            `[System] Sandbox execution.`,
            rawData.success ? `[SUCCESS] Run succeeded!` : `[FAILED] Run failed.`
          ];
        }

        mappedData = {
          ...rawData,
          logs: logsArray
        };
      }

      setEvaluation(mappedData);

      if (mappedData.success) {
        // Append to completed list if not already there
        if (!completedIds.includes(activeChallenge.id)) {
          const nextCompleted = [...completedIds, activeChallenge.id];
          setCompletedIds(nextCompleted);
          localStorage.setItem("intelligent_codelabs_completed", JSON.stringify(nextCompleted));
        }
      } else {
        // Change to material tab on mobile so they can see AI tips immediately!
        if (window.innerWidth < 1024) {
          setMobileTab("materi");
        }
      }
    } catch (err: any) {
      console.error(err);
      setEvaluation({
        success: false,
        stdout: "[Failed] Hubungan dengan AI Tutor terputus.",
        logs: [
          "[Error] Terjadi kesalahan saat memeriksa program.",
          "[Error] Silakan hubungi admin atau periksa koneksi internet."
        ],
        feedback: `### ❌ Gagal Menghubungi Server AI
Sistem gagal memproses kode Anda. Silakan coba klik tombol **Submit Code** kembali.`,
        error: err.message || "Unknown error connecting to backend API."
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Quick helper to jump to next challenge
  const handleNextChallenge = () => {
    const currentIndex = challenges.findIndex(c => c.id === activeChallenge.id);
    if (currentIndex < challenges.length - 1) {
      handleSelectChallenge(challenges[currentIndex + 1]);
    }
  };

  // Handle CTA switch to dashboard with focus
  const handleGetStartedState = () => {
    setActivePage("dashboard");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const handleAuthSuccess = (syncedUser: any, syncedState: any) => {
    setUser(syncedUser);
    setUserState(syncedState);
    matchChallengeToState(syncedState);
    setActivePage("dashboard");
    window.history.pushState({}, "", "/dashboard");
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 select-none ${
      isDark ? "bg-[#090d16] text-gray-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* GLOBAL NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 h-16 border-b z-50 backdrop-blur-md transition-colors duration-205 ${
        isDark 
          ? "bg-[#090d16]/85 border-[#1f2937]/75" 
          : "bg-white/90 border-slate-200 shadow-xs"
      }`}>
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActivePage("landing")}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-extrabold text-base tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Intelligent <span className="text-indigo-600 dark:text-indigo-400">CodeLabs</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                PRO LAB v1.2
              </span>
            </div>
          </div>

          {/* Links Navigasi (Visual purposes, with CTA integration) */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => { setActivePage("landing"); setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }), 80); }}
              className={`text-sm font-medium transition-colors ${
                isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => { setActivePage("landing"); setTimeout(() => document.getElementById("languages-showcase")?.scrollIntoView({ behavior: "smooth" }), 80); }}
              className={`text-sm font-medium transition-colors ${
                isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Explore
            </button>
            <button 
              onClick={() => setActivePage("dashboard")}
              className={`text-sm font-medium transition-colors ${
                isDark ? "text-slate-405 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sandbox Dashboard
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-yellow-400 hover:text-yellow-300 hover:bg-slate-800/80" 
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={isDark ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}
              id="theme-toggle"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Premium Button Switchers */}
            <div 
              ref={dropdownRef}
              className="relative hidden sm:block"
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-505 hover:from-indigo-500 hover:to-indigo-405 font-sans text-xs font-bold tracking-wide text-white px-4.5 py-2.5 rounded-lg shadow-md shadow-indigo-600/25 dark:shadow-indigo-500/10 hover:shadow-indigo-600/35 transition-all transform active:scale-95 duration-200"
                id="multi-lang-dropdown-trigger"
              >
                <span>MULAI BELAJAR</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Menu Dropdown Premium Desktop Grid */}
              {isDropdownOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-[725px] rounded-2xl border p-5 z-50 shadow-2xl transition-all duration-305 flex flex-col gap-4 ${
                    isDark 
                      ? "bg-[#0c1221]/95 border-slate-800 text-gray-200 shadow-black/80" 
                      : "bg-white border-slate-200 text-slate-900 shadow-slate-350/50"
                  } backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/85 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-indigo-500 dark:text-indigo-400">
                        Multi-Language Curriculum Navigator
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Kemampuan Komparatif Sandbox
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase border-b pb-1 dark:border-slate-800/60 border-slate-100">
                          <span className={`${cat.color} font-mono`}>✦</span>
                          <span className={isDark ? "text-slate-355" : "text-slate-700"}>{cat.title}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {cat.items.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                routeToTechnology(item.name);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 group border border-transparent ${
                                isDark 
                                  ? "hover:bg-indigo-650/10 hover:border-indigo-505/20 text-slate-300 hover:text-white" 
                                  : "hover:bg-indigo-50 hover:border-indigo-100 text-slate-700 hover:text-indigo-900 shadow-3xs"
                              }`}
                            >
                              <span className="text-sm transform group-hover:scale-115 transition-transform duration-200 select-none">
                                {item.icon}
                              </span>
                              <span className="truncate">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Landing page button always active on Dashboard */}
            {activePage === "dashboard" && (
              <button
                onClick={() => setActivePage("landing")}
                className={`hidden sm:flex items-center gap-1.5 text-xs font-bold tracking-wider px-4 py-2.5 rounded-lg border transition-all active:scale-95 duration-200 ${
                  isDark 
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-2xs"
                }`}
              >
                <span>LANDING PAGE</span>
              </button>
            )}

            {/* Real Authentication Profiling State / Links */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-xs font-bold py-2.5 px-4 rounded-lg border transition-all cursor-pointer ${
                    isDark 
                      ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:text-indigo-400" 
                      : "bg-white border-slate-200 text-slate-705 hover:bg-slate-100 hover:text-indigo-600 shadow-3xs"
                  }`}
                  id="navbar-login-btn"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block text-xs font-bold py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 cursor-pointer"
                  id="navbar-register-btn"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3" id="navbar-user-profile">
                <div className="hidden md:flex flex-col text-right">
                  <span className={`text-[11px] font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    {user.displayName || "Siswa Codelabs"}
                  </span>
                  <span className="text-[9px] font-mono font-medium text-indigo-400 dark:text-indigo-300 uppercase">
                    Level {userState?.currentSubBabIndex !== undefined ? `S${userState.currentSubBabIndex + 1}` : "S1"} Aktif
                  </span>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center gap-1.5 focus:outline-hidden">
                    <img 
                      src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                      alt="User Avatar"
                      referrerPolicy="no-referrer"
                      className="w-8.5 h-8.5 rounded-full object-cover border-2 border-indigo-500/75 shadow-lg shadow-indigo-500/10 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    />
                  </button>

                  {/* Elegant User Dropdown on Hover/Group */}
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl border p-3.5 z-50 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ${
                    isDark ? "bg-[#0c1221]/95 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
                  }`}>
                    <div className="border-b pb-2 mb-2 border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold truncate">{user.displayName || "Siswa Codelabs"}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await signOut(auth);
                          setUser(null);
                          setUserState(null);
                          setActivePage("landing");
                          window.history.pushState({}, "", "/");
                        } catch (logoutErr) {
                          console.error("Gagal logout:", logoutErr);
                        }
                      }}
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Sign Out)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Nav Menu toggler */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg border transition-colors ${
                isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

        </div>
      </nav>

      {/* MOBILE EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed top-16 left-0 right-0 border-b p-5 space-y-4 z-40 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto transition-all ${
          isDark ? "bg-[#0c111d]/95 border-slate-850" : "bg-white border-slate-200"
        } backdrop-blur-lg`}>
          <div className="grid grid-cols-2 gap-2 text-center">
            <button
              onClick={() => { setActivePage("landing"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-xs font-bold border ${isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-250 text-slate-700"}`}
            >
              Landing Page
            </button>
            <button
              onClick={() => { setActivePage("dashboard"); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-xs font-bold border ${isDark ? "bg-slate-905 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-250 text-slate-700"}`}
            >
              Sandbox UI
            </button>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Bahasa Pemrograman</span>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold font-mono">20 Modul S1</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {dropdownTechnologies.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => {
                    routeToTechnology(tech.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all border ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <span className="text-sm shrink-0">{tech.icon}</span>
                  <span className="truncate font-semibold">{tech.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER ACTIVE PAGES CONTAINER with top padding offsetting fixed navbar */}
      <div className="pt-16 h-[calc(100vh)] flex flex-col">

        {/* ========================================= */}
        {/* VIEW 1: LANDING PAGE */}
        {/* ========================================= */}
        {activePage === "landing" && (
          <div className="flex-1 overflow-y-auto">
            
            {/* HERO VALUE PROPOSITION SECTION */}
            <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
              <motion.div 
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto text-center space-y-6 relative z-10"
              >
                
                {/* Visual Accent Badge */}
                <motion.div 
                  variants={fadeInRise} 
                  custom={0}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 mx-auto animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive AI Sandbox Playground v1.2</span>
                </motion.div>

                {/* Main Heading Title with beautiful linear-gradient glows mapping text-shimmer class */}
                <motion.h1 
                  variants={fadeInRise} 
                  custom={1}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto text-shimmer"
                >
                  Kuasai Pemrograman Komparatif dengan Bimbingan dari AI Mentor
                </motion.h1>

                {/* Subtitle Description */}
                <motion.p 
                  variants={fadeInRise} 
                  custom={2}
                  className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Tinggalkan video tutorial pasif. Belajar coding 10x lebih efektif dengan menulis solusi real, 
                  menjalankannya di editor terintegrasi, dan menelaah ulasan Big O Complexity, optimasi penulisan, 
                  serta tips industri langsung dari Gemini AI secara real-time.
                </motion.p>

                {/* Main Call To Actions layout with custom responsive hover transitions */}
                <motion.div 
                  variants={fadeInRise} 
                  custom={3}
                  className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto sm:max-w-none"
                >
                  <button
                    onClick={handleGetStartedState}
                    className="w-full sm:w-auto px-8 py-4 font-sans text-sm font-bold tracking-wide text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-550/45 hover-scale-premium transition-all duration-200 ease-out flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                  >
                    <span>Mulai Belajar Sekarang</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>

                {/* Subtext info indicators */}
                <motion.div 
                  variants={fadeInRise} 
                  custom={4}
                  className="pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-500"
                >
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Offline Evaluation Fallback
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    No Saved Account Required
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Built with React & Tailwind
                  </span>
                </motion.div>

              </motion.div>

              {/* Decorative Background Mesh elements for Dark theme */}
              {isDark && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-500/10 blur-[130px] rounded-full"></div>
                  <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                </div>
              )}
            </section>

            {/* PREDICTIVE METRICS GRID - MOCK COMPUTER MOCKUP PREVIEW */}
            <section className="px-4 sm:px-6 lg:px-8 pb-16">
              <div className="max-w-5xl mx-auto rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-[1.005] cursor-pointer"
                   onClick={handleGetStartedState}>
                {/* Window header */}
                <div className={`px-4 py-3 border-b flex items-center justify-between font-mono text-[11px] ${
                  isDark ? "bg-[#0c111d] border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="ml-2 font-mono text-[10px] opacity-75">dashboard_sandbox.tsx - Interactive Sandbox Engine</span>
                  </div>
                  <div className="text-indigo-500 font-bold shrink-0 animate-pulse">
                    ● PRO WORKSPACE ACTIVE
                  </div>
                </div>

                {/* Sandbox mockup interface styling */}
                <div className={`p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 ${
                  isDark ? "bg-[#111827]/90" : "bg-white"
                }`}>
                  {/* Left block overview */}
                  <div className="col-span-1 md:col-span-5 space-y-3">
                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-550 dark:text-indigo-400 uppercase tracking-wider">
                      <span>JavaScript ES6 🟨</span>
                      <span>•</span>
                      <span>S1 dari S24</span>
                    </div>
                    <h3 className="text-lg font-bold">Variabel dan Operator Dasar</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-slate-404" : "text-slate-600"}`}>
                      "Buatlah deklarasi variabel bernama **sumOfVariables** untuk memproses nilai-nilai pertambahan..."
                    </p>
                    {/* Success notification mockup */}
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs">
                      <div className="font-bold flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Lolos Semua Pengujian AI!</span>
                      </div>
                      <p className="opacity-80">Ulasan program: Berhasil mengembalikan nilai pertambahan dengan presisi optimal.</p>
                    </div>
                  </div>

                  {/* Right block mockup editor */}
                  <div className="col-span-1 md:col-span-7 font-mono text-xs bg-black/95 text-slate-100 rounded-xl p-4 border border-slate-800/60 flex flex-col justify-between min-h-[180px]">
                    <div className="space-y-1 select-text">
                      <div className="text-slate-500">// Tulis kode fungsi JavaScript Anda di sini</div>
                      <div>{"function hitungJumlah(a, b) {"}</div>
                      <div className="text-emerald-400">{"  const sumOfVariables = a + b;"}</div>
                      <div className="text-indigo-400">{"  return sumOfVariables;"}</div>
                      <div>{"}"}</div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Console outputs: [Success 100%]</span>
                      <span className="bg-indigo-600 text-white font-semibold px-2 py-0.5 rounded">SUBMIT</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className={`py-16 md:py-24 border-t ${
              isDark ? "bg-[#0a0f1d]/60 border-slate-900" : "bg-slate-100/40 border-slate-200"
            }`} id="features">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Feature Session Header */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInRise}
                  custom={0}
                  className="text-center space-y-4 max-w-3xl mx-auto"
                >
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    Mengapa Belajar di Intelligent CodeLabs?
                  </h2>
                  <p className={`text-sm sm:text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Kami menggabungkan IDE terstandarisasi industri dengan asisten AI mutakhir 
                    untuk menciptakan ekosistem belajar paling mandiri dan cepat.
                  </p>
                </motion.div>

                {/* Features cards Grid 3 columns */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  
                  {/* Card 1: 20+ Bahasa Pemrograman */}
                  <motion.div 
                    variants={fadeInRise}
                    custom={0}
                    className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg group hover:scale-[1.03] hover-scale-premium cursor-pointer ${
                      isDark 
                        ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40" 
                        : "bg-white border-zinc-200/80 shadow-xs hover:border-indigo-400"
                    }`}
                  >
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl w-fit mb-4">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">20+ Bahasa Pemrograman</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Pelajari sintaks, tipe data, manipulasinya dalam JavaScript, TypeScript, Python, C++, SQL, dan banyak modul lainnya secara fleksibel.
                    </p>
                  </motion.div>

                  {/* Card 2: AI Evaluator Instan */}
                  <motion.div 
                    variants={fadeInRise}
                    custom={1}
                    className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg group hover:scale-[1.03] hover-scale-premium cursor-pointer ${
                      isDark 
                        ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40" 
                        : "bg-white border-zinc-200/80 shadow-xs hover:border-indigo-400"
                    }`}
                  >
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl w-fit mb-4 animate-pulse">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">AI Evaluator Instan</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Dapatkan review penganalisa kode instan didukung Gemini 3.5-Flash untuk memeriksa optimasi Big O, kesesuaian logic, dan bug-fixing.
                    </p>
                  </motion.div>

                  {/* Card 3: Kurikulum Terstruktur Easy-to-Hard */}
                  <motion.div 
                    variants={fadeInRise}
                    custom={2}
                    className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg group hover:scale-[1.03] hover-scale-premium cursor-pointer ${
                      isDark 
                        ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40" 
                        : "bg-white border-zinc-200/80 shadow-xs hover:border-indigo-400"
                    }`}
                  >
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-4">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Kurikulum Easy-to-Hard</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Materi disusun modular dari pemahaman variabel paling mendasar hingga algoritma heuristik, data structure, dan optimasi kueri lanjut.
                    </p>
                  </motion.div>

                  {/* Card 4: Standard Industri Coding IDE */}
                  <motion.div 
                    variants={fadeInRise}
                    custom={3}
                    className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg group hover:scale-[1.03] hover-scale-premium cursor-pointer ${
                      isDark 
                        ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40" 
                        : "bg-white border-zinc-200/80 shadow-xs hover:border-indigo-400"
                    }`}
                  >
                    <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl w-fit mb-4">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Monaco Sandbox IDE</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Tulis program langsung di antarmuka web premium ditenagai mesin penganalisa Monaco Editor layout layaknya Visual Studio Code asli.
                    </p>
                  </motion.div>

                  {/* Card 5: Real-time Runtime Console */}
                  <motion.div 
                    variants={fadeInRise}
                    custom={4}
                    className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg group hover:scale-[1.03] hover-scale-premium cursor-pointer ${
                      isDark 
                        ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40" 
                        : "bg-white border-zinc-200/80 shadow-xs hover:border-indigo-400"
                    }`}
                  >
                    <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl w-fit mb-4">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Konsol Kompilasi Instan</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Visualisasikan output log program Anda, lacak error baris per baris, dan verifikasi runtime output secara aman di panel terisolasi.
                    </p>
                  </motion.div>

                  {/* Card 6: Gamifikasi & Streak Tracking */}
                  <motion.div 
                    variants={fadeInRise}
                    custom={5}
                    className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg group hover:scale-[1.03] hover-scale-premium cursor-pointer ${
                      isDark 
                        ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40" 
                        : "bg-white border-zinc-200/80 shadow-xs hover:border-indigo-400"
                    }`}
                  >
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl w-fit mb-4">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Streak Tracking & Progress</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Dapatkan motivasi belajar berkesinambungan dengan pencatat streak hari, status modul lulus-uji, dan persentase pengerjaan dinamis.
                    </p>
                  </motion.div>

                </motion.div>

              </div>
            </section>

            {/* LANGUAGES SHOWCASE SECTION */}
            <section className="py-16 px-4 max-w-7xl mx-auto space-y-12" id="languages-showcase">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                  <Braces className="w-3.5 h-3.5" />
                  <span>Programming Languages Showcase</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Eksplorasi Kurikulum Komparatif</h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Silabus interaktif dirancang untuk membantu Anda membandingkan sintaksis dan arsitektur antar bahasa secara paralel.
                </p>
              </div>

              {/* Grid 3-kolom yang konsisten */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. JavaScript */}
                <div 
                  onClick={() => {
                    const jsChallenge = defaultChallenges.find(c => c.technology === "JavaScript");
                    if (jsChallenge) handleSelectChallenge(jsChallenge);
                    setActivePage("dashboard");
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-1" 
                      : "bg-white border-zinc-200/80 shadow-xs hover:-translate-y-1 hover:border-indigo-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        JavaScript 🟨
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                        JavaScript ES6+
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Kuasai logika dasar, manipulasi DOM, ES6+, hingga asinkronus Promise dan Async/Await.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-800/60 dark:border-slate-805/40 flex items-center justify-between text-xs font-mono text-indigo-550 dark:text-indigo-400 font-semibold group-hover:underline">
                    <span>Mulai Belajar JavaScript</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. TypeScript */}
                <div 
                  onClick={() => {
                    const tsChallenge = defaultChallenges.find(c => c.technology === "TypeScript");
                    if (tsChallenge) handleSelectChallenge(tsChallenge);
                    setActivePage("dashboard");
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-1" 
                      : "bg-white border-zinc-200/80 shadow-xs hover:-translate-y-1 hover:border-indigo-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                        <Braces className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        TypeScript 🟦
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                        TypeScript Type-Safety
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Pelajari static typing, interfaces, generics, hingga advanced utility types untuk aplikasi skala besar.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-800/60 dark:border-slate-850/40 flex items-center justify-between text-xs font-mono text-indigo-550 dark:text-indigo-400 font-semibold group-hover:underline">
                    <span>Mulai Belajar TypeScript</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Python */}
                <div 
                  onClick={() => {
                    const pyChallenge = defaultChallenges.find(c => c.technology === "Python");
                    if (pyChallenge) handleSelectChallenge(pyChallenge);
                    setActivePage("dashboard");
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-1" 
                      : "bg-white border-zinc-200/80 shadow-xs hover:-translate-y-1 hover:border-indigo-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        Python 🐍
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDark ? "text-white" : "text-slate-905"}`}>
                        Pythonic Paradigms
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-404" : "text-slate-600"}`}>
                        Dari aturan indentasi, data structures, OOP, hingga konsep konkurensi dasar dan generators.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-800/60 dark:border-slate-850/40 flex items-center justify-between text-xs font-mono text-indigo-550 dark:text-indigo-400 font-semibold group-hover:underline">
                    <span>Mulai Belajar Python</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Go */}
                <div 
                  onClick={() => {
                    alert("Modul Go Lang sedang dipersiapkan oleh AI Kurikulum kami. Coba JavaScript, TypeScript, atau Python untuk saat ini.");
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg hover:shadow-indigo-505/10 cursor-pointer group flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-1" 
                      : "bg-white border-zinc-200/80 shadow-xs hover:-translate-y-1 hover:border-indigo-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-sky-100 text-sky-800 border border-sky-200"
                      }`}>
                        Go Lang 🐹
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                        Go Concurrency & Pipes
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Pahami goroutines, channels, pointer, dan penanganan error eksplisit ala backend engineer modern.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-800/60 dark:border-slate-850/40 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-500 font-semibold">
                    <span>Materi Locked (Segera Hadir)</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </div>

                {/* 5. Rust */}
                <div 
                  onClick={() => {
                    alert("Modul Rust Systems sedang dipersiapkan oleh AI Kurikulum kami. Coba JavaScript, TypeScript, atau Python untuk saat ini.");
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg hover:shadow-indigo-505/10 cursor-pointer group flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-1" 
                      : "bg-white border-zinc-200/80 shadow-xs hover:-translate-y-1 hover:border-indigo-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-100 text-orange-850 border border-orange-200"
                      }`}>
                        Rust 🦀
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                        Rust Ownership & Borrowing
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Eksplorasi sistem memory management, ownership, borrowing rules, hingga concurrency yang aman.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-800/60 dark:border-slate-850/40 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-500 font-semibold">
                    <span>Materi Locked (Segera Hadir)</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </div>

                {/* 6. SQL */}
                <div 
                  onClick={() => {
                    alert("Modul SQL Databases sedang dipersiapkan oleh AI Kurikulum kami. Coba JavaScript, TypeScript, atau Python untuk saat ini.");
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-350 hover:shadow-lg hover:shadow-indigo-505/10 cursor-pointer group flex flex-col justify-between ${
                    isDark 
                      ? "bg-[#111827]/60 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-1" 
                      : "bg-white border-zinc-200/80 shadow-xs hover:-translate-y-1 hover:border-indigo-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-indigo-500/10 text-indigo-555 rounded-xl">
                        <Database className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-indigo-505/10 text-indigo-400 border border-indigo-500/20" : "bg-indigo-100 text-indigo-850 border border-indigo-200"
                      }`}>
                        SQL Aggregates 📊
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                        SQL & Relational DB
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Kuasai kueri relasional dari SELECT dasar, multi-table JOINS, agregasi, hingga subqueries kompleks.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-dashed border-slate-800/60 dark:border-slate-850/40 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-500 font-semibold">
                    <span>Materi Locked (Segera Hadir)</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </div>

              </div>
            </section>

            {/* MINIMALIST CLEAN FOOTER */}
            <footer className={`py-12 border-t text-center space-y-4 px-4 transition-colors ${
              isDark ? "bg-[#0b101c] border-slate-900 text-slate-400" : "bg-white border-slate-200 text-slate-600"
            }`}>
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
                <div>
                  Copyright © 2026 Samuel Alvincent. All Rights Reserved.
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1">
                  <span className="font-bold font-mono tracking-wider px-3 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-md shadow-sm">
                    #JuaraVibeCoding
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-405 font-medium leading-tight">
                    By Google Development Group Cloud Jakarta
                  </span>
                </div>
              </div>
            </footer>

          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 2: INTERACTIVE DASHBOARD SANDBOX */}
        {/* ========================================= */}
        {activePage === "dashboard" && (
          <div className="flex-1 min-h-0 flex flex-col">
            
            {/* MINI HEADER ACTIVE STATUS INFO BAR */}
            <div className={`h-11 border-b hidden md:flex items-center justify-between px-6 shrink-0 transition-colors ${
              isDark ? "bg-[#0c111d] border-[#1f2937]/65" : "bg-white border-slate-205"
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-indigo-500 dark:text-indigo-400">● Modul Aktif:</span>
                <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                  S{activeChallenge.index} - {activeChallenge.title}
                </span>
                <span className="opacity-40">/</span>
                <span className="text-slate-500">Persentasi Belajar: {completedIds.length} dari {challenges.length} selesai</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Back to landing page trigger */}
                <button
                  onClick={() => setActivePage("landing")}
                  className={`text-[11px] font-bold font-mono py-1 px-2.5 rounded border transition-all ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                      : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  ◀ Kembali ke Beranda
                </button>

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="font-mono text-[10px] text-slate-500">Sandbox Terkoneksi Lancar</span>
                </div>
              </div>
            </div>

            {/* MOBILE TAB CONTROLLER (ONLY ON SMALL WIDTHS) */}
            <div className={`lg:hidden h-11 border-b flex items-center select-none shrink-0 transition-colors ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-205"
            }`}>
              <button
                onClick={() => setMobileTab("materi")}
                className={`flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
                  mobileTab === "materi" 
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 bg-slate-800/10" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Instruksi {evaluation?.success ? "✨" : ""}</span>
              </button>
              <button
                onClick={() => setMobileTab("editor")}
                className={`flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
                  mobileTab === "editor" 
                    ? "text-indigo-600 dark:text-indigo-405 border-b-2 border-indigo-600 bg-slate-800/10" 
                    : "text-slate-500 hover:text-slate-805"
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Code Sandbox</span>
              </button>
              <button
                onClick={() => setMobileTab("progress")}
                className={`flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
                  mobileTab === "progress" 
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 bg-slate-800/10" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Console Logs ({completedIds.length})</span>
              </button>
            </div>

            {/* CORE SPLITPANELS CONTAINER */}
            <div className="flex-1 min-h-0 relative">
              
              {/* DESKTOP 3-COLUMN LAYOUT */}
              <div className="hidden lg:grid lg:grid-cols-12 h-full">
                
                {/* PANEL KIRI: Materi & Deskripsi Tantangan */}
                <div className="lg:col-span-4 h-full min-h-0">
                  <LeftPanel 
                    challenge={activeChallenge} 
                    evaluation={evaluation} 
                    loading={submitting} 
                    theme={theme}
                  />
                </div>

                {/* PANEL TENGAH: Editor Sandbox Terbuka */}
                <div className="lg:col-span-5 h-full min-h-0">
                  <MiddlePanel
                    challenge={activeChallenge}
                    code={code}
                    onChangeCode={handleCodeChange}
                    onSubmit={handleSubmitCode}
                    onReset={handleResetCode}
                    submitting={submitting}
                    theme={theme}
                  />
                </div>

                {/* PANEL KANAN: Tracker Progress & Console output */}
                <div className="lg:col-span-3 h-full min-h-0">
                  <RightPanel
                    challenges={challenges}
                    activeChallenge={activeChallenge}
                    onSelectChallenge={handleSelectChallenge}
                    evaluation={evaluation}
                    completedIds={completedIds}
                    theme={theme}
                  />
                </div>

              </div>

              {/* MOBILE SINGLE TAB DISPLAYED LAYOUT */}
              <div className="lg:hidden h-full">
                
                {mobileTab === "materi" && (
                  <div className="h-full">
                    <LeftPanel 
                      challenge={activeChallenge} 
                      evaluation={evaluation} 
                      loading={submitting} 
                      theme={theme}
                    />
                  </div>
                )}

                {mobileTab === "editor" && (
                  <div className="h-full">
                    <MiddlePanel
                      challenge={activeChallenge}
                      code={code}
                      onChangeCode={handleCodeChange}
                      onSubmit={handleSubmitCode}
                      onReset={handleResetCode}
                      submitting={submitting}
                      theme={theme}
                    />
                  </div>
                )}

                {mobileTab === "progress" && (
                  <div className="h-full">
                    <RightPanel
                      challenges={challenges}
                      activeChallenge={activeChallenge}
                      onSelectChallenge={handleSelectChallenge}
                      evaluation={evaluation}
                      completedIds={completedIds}
                      theme={theme}
                    />
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ========================================= */}
        {/* VIEW 3: LOGIN PAGE */}
        {/* ========================================= */}
        {activePage === "login" && (
          <LoginView 
            isDark={isDark} 
            onSuccess={handleAuthSuccess}
            onNavigateToRegister={() => {
              setActivePage("register");
              window.history.pushState({}, "", "/register");
            }}
            onNavigateToHome={() => {
              setActivePage("landing");
              window.history.pushState({}, "", "/");
            }}
          />
        )}

        {/* ========================================= */}
        {/* VIEW 4: REGISTER PAGE */}
        {/* ========================================= */}
        {activePage === "register" && (
          <RegisterView 
            isDark={isDark} 
            onSuccess={handleAuthSuccess}
            onNavigateToLogin={() => {
              setActivePage("login");
              window.history.pushState({}, "", "/login");
            }}
            onNavigateToHome={() => {
              setActivePage("landing");
              window.history.pushState({}, "", "/");
            }}
          />
        )}

      </div>

      {/* STICKY TOAST BANNER FOR SUCESS CELEBRATION */}
      {evaluation?.success && !submitting && activePage === "dashboard" && (
        <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-[420px] bg-emerald-950/95 border border-emerald-500/50 p-4 rounded-xl shadow-2xl shadow-emerald-900/40 backdrop-blur-md shrink-0 flex items-start gap-3.5 z-50 animate-bounce">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full shrink-0">
            <CheckCircle className="w-5 h-5 fill-emerald-500/10" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-bold text-emerald-300">Selamat! Kode Anda Valid 🎉</h5>
            <p className="text-xs text-slate-300 mb-2.5">Tantangan "{activeChallenge.title}" telah Anda kuasai dengan baik sesuai arahan AI Tutor.</p>
            <div className="flex gap-2">
              <button
                onClick={handleNextChallenge}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[11px] font-bold tracking-wider px-3.5 py-1.5 rounded-md transition-all duration-200"
              >
                LANJUT TANTANGAN BEKUTNYA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APP INFO EXPLANATION MODAL (OVERLAY) */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-55">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl text-slate-100">
            <div className="bg-indigo-950/40 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-gray-100 tracking-tight">Mengenal Intelligent CodeLabs</h3>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm leading-relaxed text-slate-300">
              <p>
                Selamat datang di <strong className="text-indigo-400">Intelligent CodeLabs</strong>, platform belajar pemrograman interaktif dengan bimbingan asisten AI personal bertenaga <strong className="text-gray-105">Gemini 3.5-Flash</strong>!
              </p>

              <div className="space-y-2 border-l-2 border-indigo-500/40 pl-3">
                <div className="font-semibold text-slate-205">🛠️ Monaco Editor Sandbox:</div>
                <p className="text-xs text-slate-400">Tulis solusi asli dalam antarmuka pemrograman premium yang dilengkapi IntelliSense modern, syntax highlighting, dan auto-indentasi layaknya VS Code.</p>
              </div>

              <div className="space-y-2 border-l-2 border-indigo-500/40 pl-3">
                <div className="font-semibold text-slate-200">💡 Dynamic Gemini AI Review:</div>
                <p className="text-xs text-slate-400">Setiap penyerahan kode akan diproses, dikompilasi, dan dievaluasi secara cerdas oleh asisten AI untuk memberikan analisa kebenaran solusi, Big O Complexity, hingga tip-tip peningkatannya.</p>
              </div>

              <div className="space-y-2 border-l-2 border-indigo-500/40 pl-3">
                <div className="font-semibold text-slate-200">📈 Progress Indexing:</div>
                <p className="text-xs text-slate-400">Lacak progress penguasaan materi (S-index) Anda dengan timeline peta jalan pembelajaran yang terstruktur.</p>
              </div>

              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tekan tombol di panel kanan untuk beralih tantangan secara instan.</span>
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 border-t border-slate-800 px-5 flex justify-end">
              <button
                onClick={() => { setShowInfo(false); handleGetStartedState(); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all"
              >
                Mulai Belajar Now!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
