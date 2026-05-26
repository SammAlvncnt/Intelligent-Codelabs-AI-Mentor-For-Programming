import { Challenge, EvaluationResult } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Sparkles, CheckCircle2, AlertCircle, Cpu, BookOpen, Layers } from "lucide-react";

interface LeftPanelProps {
  challenge: Challenge;
  evaluation: EvaluationResult | null;
  loading: boolean;
  theme: "dark" | "light";
}

export function LeftPanel({ challenge, evaluation, loading, theme }: LeftPanelProps) {
  const isDark = theme === "dark";

  // Determine tech color pill
  const getTechBadgeColor = (tech: string) => {
    if (isDark) {
      switch (tech) {
        case "JavaScript":
          return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        case "TypeScript":
          return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
        case "Python":
          return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      }
    } else {
      switch (tech) {
        case "JavaScript":
          return "bg-amber-100 text-amber-800 border border-amber-200";
        case "TypeScript":
          return "bg-blue-100 text-blue-800 border border-blue-200";
        case "Python":
          return "bg-emerald-100 text-emerald-800 border border-emerald-200";
        default:
          return "bg-slate-100 text-slate-800 border border-slate-200";
      }
    }
  };

  const getDifficultyBadge = (diff: string) => {
    if (isDark) {
      switch (diff) {
        case "Easy":
          return "bg-green-500/10 text-green-400 border border-green-500/20";
        case "Medium":
          return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
        case "Hard":
          return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      }
    } else {
      switch (diff) {
        case "Easy":
          return "bg-green-100 text-green-800 border border-green-200";
        case "Medium":
          return "bg-orange-100 text-orange-800 border border-orange-200";
        case "Hard":
          return "bg-rose-100 text-rose-850 border border-rose-200";
        default:
          return "bg-slate-100 text-slate-800 border border-slate-200";
      }
    }
  };

  return (
    <div 
      className={`flex flex-col h-full overflow-hidden transition-all duration-200 ${
        isDark 
          ? "bg-[#111827]/70 backdrop-blur-xl border-r border-[#1f2937]" 
          : "bg-white border-r border-slate-200"
      }`} 
      id="left-panel"
    >
      {/* Scrollable description content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Meta Info Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 ${getTechBadgeColor(challenge.technology)}`}>
              <span>{challenge.techIcon}</span>
              <span>{challenge.technology}</span>
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getDifficultyBadge(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span 
              className={`text-xs font-mono flex items-center gap-1 px-2.5 py-1 border rounded-md transition-colors ${
                isDark 
                  ? "text-slate-400 bg-slate-800/40 border-slate-700/30" 
                  : "text-slate-600 bg-slate-100 border-slate-200"
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              <span>{challenge.subChapter}</span>
            </span>
          </div>

          <h1 
            className={`text-xl font-bold flex items-center gap-2 tracking-tight transition-colors ${
              isDark ? "text-gray-100" : "text-slate-900"
            }`}
          >
            <BookOpen className={`w-5 h-5 shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <span>{challenge.title}</span>
          </h1>
        </div>

        {/* Challenge Goal & Task Instruction */}
        <div 
          className={`p-4 rounded-xl border leading-relaxed text-sm transition-colors ${
            isDark 
              ? "bg-slate-900/45 border-slate-800/60 text-slate-300" 
              : "bg-slate-50/80 border-slate-100 text-slate-700"
          }`}
        >
          <MarkdownRenderer content={challenge.description} />
        </div>

        {/* AI Insight / Feedback Box */}
        <div className="space-y-3">
          <div 
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              isDark ? "text-gray-200" : "text-slate-700"
            }`}
          >
            <Sparkles className={`w-4 h-4 animate-pulse ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            <span>AI Insight & Feedback</span>
          </div>

          {loading ? (
            <div 
              className={`p-5 rounded-xl space-y-3 border animate-pulse ${
                isDark 
                  ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-300" 
                  : "bg-indigo-50/50 border-indigo-200 text-indigo-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className={`w-5 h-5 animate-spin ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <span className="text-sm font-medium">AI Tutor sedang menganalisis kode Anda...</span>
              </div>
              <div className={`h-2 rounded-md w-full ${isDark ? "bg-indigo-500/20" : "bg-indigo-200"}`}></div>
              <div className={`h-2 rounded-md w-5/6 ${isDark ? "bg-indigo-500/20" : "bg-indigo-200"}`}></div>
              <div className={`h-2 rounded-md w-2/3 ${isDark ? "bg-indigo-500/20" : "bg-indigo-200"}`}></div>
            </div>
          ) : evaluation ? (
            <div 
              className={`p-5 rounded-xl border transition-all duration-300 ${
                evaluation.success 
                  ? isDark 
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-900 focus-within:ring-2 focus-within:ring-emerald-400 shadow-sm"
                  : isDark 
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-400 focus-within:ring-2 focus-within:ring-rose-500"
                    : "bg-rose-50 border-rose-200 text-rose-900 focus-within:ring-2 focus-within:ring-rose-400 shadow-sm"
              }`}
            >
              {/* Header result alert */}
              <div className="flex items-start gap-3 mb-4">
                {evaluation.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-md font-bold ${evaluation.success ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                    {evaluation.success ? "Lolos Semua Pengujian!" : "Terdapat Beberapa Kendala"}
                  </h4>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {evaluation.success 
                      ? "Kode berjalan optimal seperti yang direkomendasikan." 
                      : "Jangan berkecil hati, ikuti saran evaluasi AI di bawah ini untuk belajar."}
                  </p>
                </div>
              </div>

              {/* MD Render Feedback Content */}
              <div className={`border-t pt-3 mt-3 overflow-wrap-anywhere ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
                <MarkdownRenderer content={evaluation.feedback} />
              </div>

              {/* Show raw error block if present */}
              {evaluation.error && (
                <div 
                  className={`mt-4 p-3 rounded-lg text-xs font-mono border ${
                    isDark 
                      ? "bg-red-950/40 border-red-500/30 text-red-350" 
                      : "bg-red-50 border-red-200 text-red-850"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Runtime Debug/Compiler Error:</span>
                  </div>
                  <pre className="whitespace-pre-wrap overflow-x-auto">{evaluation.error}</pre>
                </div>
              )}
            </div>
          ) : (
            <div 
              className={`p-5 rounded-xl border flex items-start gap-3.5 transition-colors ${
                isDark 
                  ? "bg-slate-900/30 border-slate-800 text-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              <div className="text-sm leading-relaxed">
                <span className={`font-semibold block mb-1 ${isDark ? "text-slate-350" : "text-slate-700"}`}>Menunggu Submit...</span>
                Selesaikan kode fungsi di editor tengah. Klik <strong className={isDark ? "text-indigo-400 font-semibold" : "text-indigo-600 font-semibold"}>Submit Code</strong> untuk meminta AI Tutor mengevaluasi logika program, performa waktu, linting, serta optimasi kode.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
