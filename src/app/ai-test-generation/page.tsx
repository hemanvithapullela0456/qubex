"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Play, Copy, ChevronDown } from "lucide-react";
import { BsFileEarmarkCode} from "react-icons/bs";

interface AIUnitTestProps {
  selectedFile: { name: string; language: string; content: string } | null;
}

const languageMap: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  c: 50,
  cpp: 54,
  csharp: 51,
  go: 60,
  ruby: 72,
  rust: 73,
  swift: 83,
  kotlin: 78,
  php: 68,
  typescript: 74,
};

const AIUnitTest = ({ selectedFile }: AIUnitTestProps) => {
  const [testCases, setTestCases] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [testOutput, setTestOutput] = useState<string>("");
  const [expanded, setExpanded] = useState(true);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    if (copyMessage) {
      const timer = setTimeout(() => setCopyMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyMessage]);

  const handleGenerateTests = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setTestCases("");
    setTestOutput("");

    try {
      const res = await fetch("/api/generate-test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: selectedFile.content,
          language: selectedFile.language,
        }),
      });

      const data = await res.json();
      setTestCases(extractTestCases(data.testCases));
    } catch (error) {
      console.error("Error generating test cases:", error);
      setTestCases("⚠️ Failed to generate test cases.");
    }
    setLoading(false);
  };

  const executeTestCases = async () => {
    if (!selectedFile || !testCases) return;
    const language_id = languageMap[selectedFile.language.toLowerCase()];
    if (!language_id) {
      alert(`Unsupported language: ${selectedFile.language}`);
      return;
    }

    setTestOutput("Running...");

    let fullCode = `${selectedFile.content}\n\n${testCases}`;
    if (selectedFile.language.toLowerCase() === "cpp") {
      fullCode = `${selectedFile.content}\n\nint main() {\n${testCases}\nreturn 0;\n}`;
    } else if (selectedFile.language.toLowerCase() === "java") {
      fullCode = `${selectedFile.content}\n\npublic class Main {\npublic static void main(String[] args) {\n${testCases}\n}\n}`;
    }

    try {
      const res = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: fullCode, language_id }),
      });

      const data = await res.json();
      setTestOutput(data.stdout || data.stderr || "No output available.");
    } catch (error) {
      console.error("Error executing test cases:", error);
      setTestOutput("⚠️ Execution failed.");
    }
  };

  const extractTestCases = (text: string): string => {
    const matches = text.match(/```(?:\w+)?\n([\s\S]*?)\n```/g);
    return matches ? matches.map((tc) => tc.replace(/```(?:\w+)?\n|\n```/g, "").trim()).join("\n\n") : "";
  };

  return (
    <div className="relative w-full h-full bg-[#161b22] border-l border-[#21262d] p-4 text-white flex flex-col font-roboto">
      {copyMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded shadow-lg text-sm">
          {copyMessage}
        </div>
      )}

<div className="bg-[#161b22] border-b border-[#21262d] p-4 mb-4">
        <div className="flex items-center gap-2 text-green-400">
          <BsFileEarmarkCode className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Test Case Generator</h2>
        </div>
      </div>

      <button
        className="w-full bg-[#CA3C25] hover:bg-[#a2321d] text-white font-bold py-2 px-4 rounded transition duration-200 mb-3"
        onClick={handleGenerateTests}
        disabled={loading || !selectedFile}
      >
        {loading ? "Generating..." : "Generate Test Cases"}
      </button>

      {testCases && (
        <div className="flex flex-col flex-1 bg-[#21262d] rounded-lg p-3 min-h-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-left mb-2"
          >
            <div className="flex items-center gap-2">
              <ChevronDown className={`w-4 h-4 transition ${expanded ? "rotate-180" : ""}`} />
              <span className="font-medium text-green-300">Generated Test Cases</span>
            </div>
          </button>

          <div className="flex-1 overflow-auto bg-[#0d1117] p-2 rounded">
            {expanded && <CodeBlock code={testCases} setCopyMessage={setCopyMessage} />}
          </div>

          {/* ✅ BUTTON FIX - Ensure it stays visible */}
          <button
            className="mt-2 w-full bg-green-600 hover:bg-green-500 transition-all text-white font-medium px-3 py-2 rounded flex items-center justify-center gap-2"
            onClick={executeTestCases}
          >
            <Play className="w-4 h-4" />
            Execute All Test Cases
          </button>
        </div>
      )}

      {testOutput && (
        <div className="flex flex-col flex-1 mt-3 bg-black text-white rounded overflow-hidden min-h-0">
          <h4 className="text-yellow-400 p-3 border-b border-gray-600">Output:</h4>
          <div className="flex-1 overflow-y-auto p-3">
            <pre className="whitespace-pre text-sm">{testOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

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
    <div className="relative flex flex-col h-full">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-[#223843] hover:bg-[#1a2d33] p-1 rounded text-white transition"
      >
        <Copy className="w-4 h-4" />
      </button>
      <div className="flex-1 overflow-auto bg-[#0d1117] p-2 rounded">
        <pre className="text-sm text-gray-200 whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
};

export default AIUnitTest;
