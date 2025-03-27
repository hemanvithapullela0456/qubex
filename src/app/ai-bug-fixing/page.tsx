"use client";

import { useState, useEffect } from "react";
import { FixBugsResponse } from "./types"; 
import { Bug, CheckCircle, Lightbulb, ChevronDown, ChevronUp, Copy } from "lucide-react";

interface AIBugFixingProps {
  selectedFile: { name: string; type: "file"; language: string; content: string } | null;
  onFileChange?: (newContent: string) => void;
}


export const AIBugFixing: React.FC<AIBugFixingProps> = ({ selectedFile}) => {
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
    <div className="relative w-full min-w-[15rem] max-w-[25rem] h-screen bg-[#161b22] border-l border-[#21262d] overflow-y-auto transition-all duration-300 p-4 text-white flex flex-col font-roboto">
      {/* Copy success message */}
      {copyMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {copyMessage}
        </div>
      )}

      {/* Heading */}
      <div className="bg-[#161b22] border-b border-[#21262d] p-4 mb-4">
        <div className="flex items-center gap-2 text-green-400">
          <Bug className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Debugging</h2>
        </div>
      </div>

      {/* Button & Language Selection */}
      <div className="p-2 flex flex-col gap-4">
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

        <button
          className="w-full bg-[#CA3C25] hover:bg-[#a2321d] text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={handlePostRequest}
          disabled={loading || !selectedFile}
        >
          {loading ? "Analyzing..." : "Suggest Fix"}
        </button>
      </div>

      {/* Response Sections */}
      <div className="flex-1 overflow-y-auto">
        {response?.errors.length ? (
          <Section
            title={`Issues Found (${response.errors.length})`}
            icon={Bug}
            type="error"
            isExpanded={expandedSections.errors}
            onToggle={() => toggleSection("errors")}
          >
            {response.errors.map((err, index) => (
              <div key={index} className="space-y-2 bg-[#CA3C25]/20 p-3 rounded">
                <h4 className="text-red-400 font-medium">{err.title} (Line {err.line})</h4>
                <CodeBlock code={err.code} setCopyMessage={setCopyMessage} />
                <p className="text-sm text-gray-400">{err.description}</p>
                <h5 className="text-green-400 font-medium mt-2">Fixed Code:</h5>
                <CodeBlock code={err.fixedCode} setCopyMessage={setCopyMessage} />
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
                <p className="text-sm text-gray-300">{suggestion.explanation}</p>
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
                <p className="text-sm text-gray-300">{practice.explanation}</p>
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
        className="absolute top-2 right-2 bg-[#223843] hover:bg-[#1a2d33] p-1 rounded text-white transition"
      >
        <Copy className="w-4 h-4" />
      </button>
      <pre className="bg-[#0d1117] p-2 rounded text-sm text-gray-200 whitespace-pre-wrap break-words overflow-x-auto">
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

const Section: React.FC<SectionProps> = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
  <div className="mb-4 bg-[#21262d] rounded-lg overflow-hidden">
    <button onClick={onToggle} className="w-full p-3 flex items-center justify-between text-left">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-100" />
        <span className="font-medium text-gray-100">{title}</span>
      </div>
      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
    {isExpanded && <div className="p-3 space-y-3">{children}</div>}
  </div>
);

export default AIBugFixing;
