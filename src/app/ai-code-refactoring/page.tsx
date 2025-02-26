"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Copy } from "lucide-react";

interface AICodeRefactoringProps {
  selectedFile: { name: string; language: string; content: string } | null;
}

export default function AICodeRefactoring({ selectedFile }: AICodeRefactoringProps) {
  const [refactoredCode, setRefactoredCode] = useState<string | null>(null);
  const [contentAboveCode, setContentAboveCode] = useState<string | null>(null);
  const [contentBelowCode, setContentBelowCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    if (copyMessage) {
      const timer = setTimeout(() => setCopyMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyMessage]);

  const handleRefactor = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const response = await fetch("/api/code-refactoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: selectedFile.content, language: selectedFile.language }),
      });

      const data = await response.json();
      const { refactoredCode, contentAbove, contentBelow } = parseResponse(data.refactoredCode);
      setRefactoredCode(refactoredCode);
      setContentAboveCode(contentAbove);
      setContentBelowCode(contentBelow);
    } catch (error) {
      console.error("Error refactoring code:", error);
    }
    setLoading(false);
  };

  const parseResponse = (response: string) => {
    const codeMatch = response.match(/```[\s\S]*?```/);
    const refactoredCode = codeMatch ? codeMatch[0].replace(/```/g, "").trim() : "";
    const [above, below] = response.split(/```[\s\S]*?```/);
    return { refactoredCode, contentAbove: above.trim(), contentBelow: below.trim() };
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative w-full min-w-[15rem] max-w-[25rem] h-screen bg-[#161b22] border-l border-[#21262d] flex flex-col text-white font-roboto">
      {/* Copy success message */}
      {copyMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {copyMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#161b22] border-b border-[#21262d] p-4 flex items-center gap-2 text-blue-400">
        <Lightbulb className="w-5 h-5" />
        <h2 className="text-lg font-semibold">AI Code Refactoring</h2>
      </div>

      {/* Content Wrapper with Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#161b22]">
        {/* Language Display */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
            Language
          </label>
          <input
            id="language"
            value={selectedFile?.language || "No file selected"}
            readOnly
            className="w-full p-2 bg-[#0d1117] text-white rounded border border-[#21262d] text-ellipsis"
          />
        </div>

        {/* Refactor Button */}
        <button
          className="w-full bg-[#CA3C25] hover:bg-[#a2321d] text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={handleRefactor}
          disabled={loading || !selectedFile}
        >
          {loading ? "Refactoring..." : "Refactor Code"}
        </button>

        {/* Content Above Code */}
        {contentAboveCode && (
          <div className="bg-[#21262d] rounded-lg p-3">
            <p className="text-gray-300 whitespace-pre-wrap">{contentAboveCode}</p>
          </div>
        )}

        {/* Refactored Code Section */}
        {refactoredCode && (
          <div className="bg-[#21262d] rounded-lg p-3">
            <h4 className="text-blue-400 font-medium mb-2">Refactored Code</h4>
            <CodeBlock code={refactoredCode} handleCopy={handleCopy} />
          </div>
        )}

        {/* Content Below Code */}
        {contentBelowCode && (
          <div className="bg-[#21262d] rounded-lg p-3">
            <p className="text-gray-300 whitespace-pre-wrap">{contentBelowCode}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Code Block Component (No File Name Displayed)
const CodeBlock: React.FC<{ code: string; handleCopy: (code: string) => void }> = ({ code, handleCopy }) => {
  return (
    <div className="relative">
      <button
        onClick={() => handleCopy(code)}
        className="absolute top-2 right-2 bg-[#223843] hover:bg-[#1a2d33] p-1 rounded text-white transition"
      >
        <Copy className="w-4 h-4" />
      </button>
      <pre className="bg-[#0d1117] p-2 rounded text-sm text-gray-200 whitespace-pre-wrap break-words overflow-x-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#161b22]">
        <code>{code}</code>
      </pre>
    </div>
  );
};
