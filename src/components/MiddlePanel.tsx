import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Challenge } from "../types";
import { Play, RotateCcw, FileCode, CheckCircle, Terminal } from "lucide-react";

interface MiddlePanelProps {
  challenge: Challenge;
  code: string;
  onChangeCode: (val: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  onReset: () => void;
  theme: "dark" | "light";
}

export function MiddlePanel({ 
  challenge, 
  code, 
  onChangeCode, 
  onSubmit, 
  submitting,
  onReset,
  theme
}: MiddlePanelProps) {
  const isDark = theme === "dark";
  const editorTheme = isDark ? "vs-dark" : "light";

  // Determine file name extension for the visual tab
  const getFileName = () => {
    switch (challenge.technology) {
      case "TypeScript":
        return "solution.ts";
      case "Python":
        return "solution.py";
      default:
        return "solution.js";
    }
  };

  const getEditorLanguage = () => {
    switch (challenge.technology) {
      case "TypeScript":
        return "typescript";
      case "Python":
        return "python";
      default:
        return "javascript";
    }
  };

  return (
    <div 
      className={`flex flex-col h-full overflow-hidden transition-all duration-200 ${
        isDark 
          ? "bg-[#0a0f1d] border-r border-[#1f2937]" 
          : "bg-slate-50 border-r border-slate-200"
      }`} 
      id="middle-panel"
    >
      {/* Tab bar header */}
      <div 
        className={`border-b h-12 px-4 flex items-center justify-between shrink-0 select-none transition-colors ${
          isDark ? "bg-[#0e1424] border-[#1f2937]" : "bg-slate-100 border-slate-200"
        }`}
      >
        <div 
          className={`flex items-center gap-1.5 border-t-2 border-x px-3.5 py-1.5 h-[47px] mt-[1px] rounded-t-md font-mono text-xs transition-colors ${
            isDark 
              ? "bg-[#0a0f1d] border-indigo-500 border-x-[#1f2937] text-gray-250" 
              : "bg-white border-indigo-600 border-x-slate-200 text-slate-800 font-semibold shadow-sm"
          }`}
        >
          <FileCode className={`w-4 h-4 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className="font-mono font-medium">{getFileName()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset code action */}
          <button
            onClick={onReset}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border rounded-md transition-all duration-200 ${
              isDark 
                ? "text-slate-400 hover:text-red-400 bg-slate-800/20 hover:bg-red-500/10 border-slate-700/30" 
                : "text-slate-600 hover:text-red-650 bg-slate-200/50 hover:bg-red-500/15 border-slate-300"
            }`}
            title="Kembalikan ke boilerplate awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={getEditorLanguage()}
          theme={editorTheme}
          value={code}
          onChange={(val) => onChangeCode(val || "")}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', Courier, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: submitting,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderWhitespace: "selection",
            tabSize: 2,
            insertSpaces: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            }
          }}
          loading={
            <div 
              className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors ${
                isDark ? "bg-[#0a0f1d]" : "bg-white"
              }`}
            >
              <div className={`w-10 h-10 border-t-2 border-r-2 rounded-full animate-spin ${isDark ? "border-indigo-500" : "border-indigo-600"}`}></div>
              <div className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading IDE, please wait...</div>
            </div>
          }
        />
      </div>

      {/* Footer bar containing Submission trigger */}
      <div 
        className={`border-t px-4 py-3 flex items-center justify-between shrink-0 transition-colors ${
          isDark ? "bg-[#0e1424] border-[#1f2937]" : "bg-slate-100 border-slate-200"
        }`}
      >
        <div className={`flex items-center gap-2 text-xs font-mono transition-colors ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Press submit to evaluate solution logs</span>
        </div>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs font-bold tracking-wide rounded-lg transition-all duration-300 transform active:scale-95 ${
            submitting
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
              : isDark
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 font-medium active:bg-indigo-700"
                : "bg-indigo-600 hover:bg-indigo-750 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20 font-semibold active:bg-indigo-700"
          }`}
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
              <span>SUBMITTING...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SUBMIT CODE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
