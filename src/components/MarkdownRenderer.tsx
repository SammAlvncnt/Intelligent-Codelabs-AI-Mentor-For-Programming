import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLanguage = "";

  const renderedElements: React.ReactNode[] = [];

  const formatText = (text: string) => {
    // Process bold (**bold**)
    let parts: React.ReactNode[] = [text];
    
    // Replace inline code block `code`
    const boldRegex = /\*\*(.*?)\*\*/g;
    const codeRegex = /`(.*?)`/g;

    // We'll write a simple tokenizer for bold and inline code
    let currentString = text;
    let tokens: { type: "text" | "bold" | "code"; value: string }[] = [];

    let lastIndex = 0;
    const combinedRegex = /(\*\*.*?\*\*|`.*?`)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchText = match[0];

      // Add preceding text
      if (matchStart > lastIndex) {
        tokens.push({ type: "text", value: text.substring(lastIndex, matchStart) });
      }

      if (matchText.startsWith("**") && matchText.endsWith("**")) {
        tokens.push({ type: "bold", value: matchText.substring(2, matchText.length - 2) });
      } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
        tokens.push({ type: "code", value: matchText.substring(1, matchText.length - 1) });
      }

      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({ type: "text", value: text.substring(lastIndex) });
    }

    if (tokens.length === 0) {
      return text;
    }

    return (
      <>
        {tokens.map((tok, i) => {
          if (tok.type === "bold") {
            return <strong key={i} className="font-extrabold text-[#f3f4f6]">{tok.value}</strong>;
          } else if (tok.type === "code") {
            return <code key={i} className="font-mono text-xs bg-slate-900 border border-slate-800 text-sky-400 px-1 py-0.5 rounded">{tok.value}</code>;
          } else {
            return tok.value;
          }
        })}
      </>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        const finalCode = codeLines.join("\n");
        renderedElements.push(
          <div key={`pre-${i}`} className="my-3 bg-[#030712] border border-slate-800 rounded-lg overflow-hidden">
            {codeLanguage && (
              <div className="bg-[#111827] px-3 py-1 text-xs border-b border-slate-800 text-slate-400 font-mono flex items-center justify-between">
                <span>{codeLanguage}</span>
                <span className="text-slate-500">Source</span>
              </div>
            )}
            <pre className="p-3 overflow-x-auto text-xs font-mono text-slate-300">
              <code>{finalCode}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeLines = [];
        codeLanguage = "";
      } else {
        // Start code block
        inCodeBlock = true;
        codeLanguage = line.trim().substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Handles Headers
    if (line.startsWith("### ")) {
      renderedElements.push(
        <h3 key={i} className="text-md font-bold text-gray-100 border-b border-slate-800 pb-2 mt-5 mb-2 flex items-center gap-2">
          {formatText(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith("#### ")) {
      renderedElements.push(
        <h4 key={i} className="text-sm font-semibold text-gray-200 mt-4 mb-1">
          {formatText(line.substring(5))}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      renderedElements.push(
        <h2 key={i} className="text-lg font-bold text-gray-100 mt-5 border-b border-slate-800 pb-1 mb-2">
          {formatText(line.substring(3))}
        </h2>
      );
    } 
    // Handle bullet list
    else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      renderedElements.push(
        <ul key={i} className="list-disc list-inside ml-4 text-sm text-slate-300 leading-relaxed my-1">
          <li>{formatText(line.trim().substring(2))}</li>
        </ul>
      );
    }
    // Handle number list
    else if (/^\d+\.\s/.test(line.trim())) {
      const parts = line.trim().split(/^\d+\.\s/);
      const match = line.trim().match(/^\d+/);
      const num = match ? match[0] : "1";
      renderedElements.push(
        <ol key={i} className="list-decimal list-inside ml-4 text-sm text-slate-300 leading-relaxed my-1">
          <li value={parseInt(num)}>{formatText(parts[1])}</li>
        </ol>
      );
    }
    // Handle horizontal rules
    else if (line.trim() === "---") {
      renderedElements.push(<hr key={i} className="border-slate-800 my-4" />);
    }
    // Handle basic empty space
    else if (line.trim() === "") {
      renderedElements.push(<div key={i} className="h-2" />);
    } 
    // Standard paragraph
    else {
      renderedElements.push(
        <p key={i} className="text-sm text-slate-300 leading-relaxed mb-2">
          {formatText(line)}
        </p>
      );
    }
  }

  return <div className="markdown-body text-slate-300">{renderedElements}</div>;
}
