import { Challenge, EvaluationResult } from "../types";
import { Terminal, CheckCircle2, Lock, Award, Flame, Circle } from "lucide-react";

interface RightPanelProps {
  challenges: Challenge[];
  activeChallenge: Challenge;
  onSelectChallenge: (challenge: Challenge) => void;
  evaluation: EvaluationResult | null;
  completedIds: string[];
  theme: "dark" | "light";
}

export function RightPanel({
  challenges,
  activeChallenge,
  onSelectChallenge,
  evaluation,
  completedIds,
  theme
}: RightPanelProps) {
  const isDark = theme === "dark";
  const totalSubChapters = challenges.length;
  const completedCount = completedIds.filter(id => challenges.some(c => c.id === id)).length;
  const progressPercent = challenges.length > 0 ? Math.round((completedCount / challenges.length) * 100) : 0;

  // Derive current streak or positive motivators
  const activeStreak = completedCount > 0 ? completedCount : 0;

  return (
    <div 
      className={`flex flex-col h-full transition-all duration-200 overflow-hidden ${
        isDark 
          ? "bg-[#111827]/70 backdrop-blur-xl" 
          : "bg-white border-l border-slate-200 shadow-sm"
      }`} 
      id="right-panel"
    >
      
      {/* 1. Progress Stats Section */}
      <div 
        className={`p-4 border-b space-y-3 shrink-0 transition-colors ${
          isDark ? "bg-[#0e1424]/90 border-[#1f2937]" : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div 
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest font-sans ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Progress Tracker</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full text-[11px] font-semibold text-amber-500 border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Streak: {activeStreak}</span>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="space-y-1">
          <div className={`flex justify-between text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-505"}`}>
            <span>S{activeChallenge.index} dari S{challenges.length} Sub-bab</span>
            <span>{progressPercent}% Selesai Lab</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-450 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
          <div 
            className={`p-1.5 rounded border text-center transition-colors ${
              isDark 
                ? "bg-slate-900/50 border-slate-800/65 text-slate-400" 
                : "bg-white border-slate-200 text-slate-600 shadow-2xs"
            }`}
          >
            <span className={`block font-bold text-xs ${isDark ? "text-gray-300" : "text-slate-900"}`}>{completedCount} / {challenges.length}</span>
            Teruji Lulus
          </div>
          <div 
            className={`p-1.5 rounded border text-center transition-colors ${
              isDark 
                ? "bg-slate-900/50 border-slate-800/65 text-slate-400" 
                : "bg-white border-slate-200 text-slate-600 shadow-2xs"
            }`}
          >
            <span className={`block font-bold text-xs ${isDark ? "text-gray-300" : "text-slate-900"}`}>{challenges.length}</span>
            Total Modul
          </div>
        </div>
      </div>

      {/* 2. Live Active Output / Console mockup */}
      <div className="flex-1 min-h-0 flex flex-col p-4 space-y-3">
        <div className="flex items-center justify-between shrink-0">
          <div className={`flex items-center gap-1.5 text-xs font-bold font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>CONSOLE MONITOR</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30"></span>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-slate-950 rounded-lg p-3.5 border border-slate-800/80 font-mono text-xs overflow-y-auto space-y-2 select-text text-slate-100">
          {evaluation ? (() => {
            const safeLogs = Array.isArray(evaluation.logs)
              ? evaluation.logs
              : (typeof evaluation.logs === "string" ? (evaluation.logs as string).split("\n") : []);
            return safeLogs.map((log, i) => {
              if (!log) return null;
              let color = "text-slate-400";
              if (log.startsWith("[SUCCESS]")) {
                color = "text-emerald-400 font-bold bg-emerald-950/45 px-1 rounded border border-emerald-550/20";
              } else if (log.startsWith("[FAILED]")) {
                color = "text-red-400 font-bold bg-red-950/45 px-1 rounded border border-red-550/20";
              } else if (log.startsWith("[System]")) {
                color = "text-sky-400";
              } else if (log.startsWith("Error")) {
                color = "text-red-300 italic";
              }

              return (
                <div key={i} className={`leading-relaxed break-all ${color}`}>
                  {log}
                </div>
              );
            });
          })() : (
            <div className="text-slate-500 h-full flex flex-col items-center justify-center text-center gap-2 px-4 italic select-none">
              <Terminal className="w-5 h-5 text-slate-605 animate-pulse" />
              <span>Console siaga. Kirimkan kode Anda untuk memunculkan logs kompilasi runtime & diagnosa asisten AI.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Interactive Sub-chapter Navigation List */}
      <div 
        className={`h-56 border-t flex flex-col shrink-0 transition-colors ${
          isDark ? "border-[#1f2937] bg-[#0c111d]/90" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div 
          className={`px-4 py-2 border-b flex items-center justify-between transition-colors ${
            isDark ? "border-[#1f2937] bg-slate-900/30 text-slate-400" : "border-slate-200 bg-slate-100/80 text-slate-600"
          }`}
        >
          <span className="text-[11px] font-bold font-mono tracking-wider">INDEX SUB-BAB MATERI</span>
          <span className="text-[10px] opacity-70">Klik untuk Ganti Challenge</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-transparent">
          {challenges.map((c) => {
            const isActive = c.id === activeChallenge.id;
            const isCompleted = completedIds.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => onSelectChallenge(c)}
                className={`w-full text-left p-2 rounded-md transition-all duration-200 flex items-center justify-between text-xs border ${
                  isActive
                    ? isDark 
                      ? "bg-indigo-600/10 border-indigo-500/40 text-gray-100 font-medium"
                      : "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-xs"
                    : isDark 
                      ? "bg-slate-900/20 hover:bg-slate-800/40 border-transparent text-slate-300 hover:text-white"
                      : "bg-white hover:bg-slate-100/50 border-slate-150 text-slate-700 hover:text-slate-900 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className={`shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    S{c.index}
                  </span>
                  <span className="truncate">{c.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-[10px] opacity-65 font-mono text-slate-400">{c.technology}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
                  ) : (
                    <Circle className={`w-3.5 h-3.5 ${isDark ? "text-slate-700" : "text-slate-300"}`} />
                  )}
                </div>
              </button>
            );
          })}

          {/* Visual decoration showing locked challenges up to S24 */}
          {Array.from({ length: totalSubChapters - challenges.length }).map((_, i) => {
            const indexNum = challenges.length + i + 1;
            return (
              <div 
                key={`locked-${indexNum}`} 
                className={`p-2 rounded-md flex items-center justify-between text-xs border border-transparent select-none opacity-45 cursor-not-allowed ${
                  isDark ? "text-slate-600 bg-transparent" : "text-slate-400 bg-slate-100/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isDark ? "bg-slate-950" : "bg-slate-200"}`}>
                    S{indexNum}
                  </span>
                  <span className="italic text-slate-500">Materi Kombinatorial {indexNum}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono opacity-80 font-semibold">SQL/Alg</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
