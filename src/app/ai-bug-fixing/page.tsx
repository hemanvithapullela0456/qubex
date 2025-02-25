"use client";

import { useState, useEffect } from "react";
import { FixBugsResponse } from "./types"; // Import your TypeScript types
import { Bug, CheckCircle, Lightbulb, ChevronDown, ChevronUp, Copy } from "lucide-react";

interface AIBugFixingProps {
  selectedFile: { name: string; type: "file"; language: string; content: string } | null;
  onFileChange: (newContent: string) => void;
}

const AIBugFixing: React.FC<AIBugFixingProps> = ({ selectedFile, onFileChange }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FixBugsResponse | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    errors: true,
    suggestions: true,
    bestPractices: true
  });
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    if (copyMessage) {
      const timer = setTimeout(() => setCopyMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyMessage]);

  const handlePostRequest = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const res = await fetch("/api/fix-bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: selectedFile.content, language: selectedFile.language }),
      });

      const data: FixBugsResponse = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error analyzing code:", error);
      setResponse(null);
    }
    setLoading(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="relative w-full md:w-[20rem] lg:w-[25rem] h-screen bg-zinc-900 border-l border-zinc-800 overflow-y-auto transition-all duration-300">
      {/* Copy success message */}
      {copyMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {copyMessage}
        </div>
      )}

      <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="flex items-center gap-2 text-green-400">
          <Bug className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Bug Fixing</h2>
        </div>
      </div>

      <div className="p-4 max-w-full">
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium text-zinc-300 mb-1">
            Language
          </label>
          <input
            id="language"
            value={selectedFile?.language || "No file selected"}
            readOnly
            className="w-full p-2 bg-zinc-800 text-white rounded"
          />
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={handlePostRequest}
          disabled={loading || !selectedFile}
        >
          {loading ? "Analyzing..." : "Suggest Fix"}
        </button>

        {response?.errors.length ? (
          <Section
            title={`Issues Found (${response.errors.length})`}
            icon={Bug}
            type="error"
            isExpanded={expandedSections.errors}
            onToggle={() => toggleSection("errors")}
          >
            {response.errors.map((err, index) => (
              <div key={index} className="space-y-2 bg-red-900/20 p-3 rounded">
                <h4 className="text-red-400 font-medium">{err.title} (Line {err.line})</h4>
                <pre className="bg-black p-2 rounded text-sm text-red-400 whitespace-pre-wrap overflow-x-auto">
                  <code>{err.code}</code>
                </pre>
                <p className="text-sm text-zinc-400">{err.description}</p>
                <h5 className="text-green-400 font-medium mt-2">Fixed Code:</h5>
                <pre className="bg-black p-2 rounded text-sm text-green-400 whitespace-pre-wrap overflow-x-auto">
                  <code>{err.fixedCode}</code>
                </pre>
              </div>
            ))}
          </Section>
        ) : null}

        {response?.suggestions.length ? (
          <Section
            title={`Code Suggestions (${response.suggestions.length})`}
            icon={Lightbulb}
            type="suggestion"
            isExpanded={expandedSections.suggestions}
            onToggle={() => toggleSection("suggestions")}
          >
            {response.suggestions.map((suggestion, index) => (
              <div key={index} className="space-y-2 bg-blue-900/20 p-3 rounded">
                <h4 className="text-blue-400 font-medium">{suggestion.title}</h4>
                <CodeBlock code={suggestion.code} setCopyMessage={setCopyMessage} />
                <p className="text-sm text-zinc-300">{suggestion.explanation}</p>
              </div>
            ))}
          </Section>
        ) : null}

        {response?.bestPractices.length ? (
          <Section
            title={`Best Practices (${response.bestPractices.length})`}
            icon={CheckCircle}
            type="practice"
            isExpanded={expandedSections.bestPractices}
            onToggle={() => toggleSection("bestPractices")}
          >
            {response.bestPractices.map((practice, index) => (
              <div key={index} className="space-y-2 bg-emerald-900/20 p-3 rounded">
                <h4 className="text-emerald-400 font-medium">{practice.title}</h4>
                <CodeBlock code={practice.code} setCopyMessage={setCopyMessage} />
                <p className="text-sm text-zinc-300">{practice.explanation}</p>
              </div>
            ))}
          </Section>
        ) : null}
      </div>
    </div>
  );
};

// Code Block with Copy Functionality
const CodeBlock: React.FC<{ code: string; setCopyMessage: (msg: string) => void }> = ({ code, setCopyMessage }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 p-1 rounded text-white"
      >
        <Copy className="w-4 h-4" />
      </button>
      <pre className="bg-black p-2 rounded text-sm text-zinc-200 whitespace-pre-wrap break-words overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

interface SectionProps {
  title: string;
  icon: React.ElementType;
  type: "error" | "suggestion" | "practice";
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, type, children, isExpanded, onToggle }) => (
  <div className="mb-4 bg-zinc-800/50 rounded-lg overflow-hidden">
    <button onClick={onToggle} className="w-full p-3 flex items-center justify-between text-left">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-zinc-100" />
        <span className="font-medium text-zinc-100">{title}</span>
      </div>
      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
    {isExpanded && <div className="p-3 space-y-3">{children}</div>}
  </div>
);

export default AIBugFixing;
