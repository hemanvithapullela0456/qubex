"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

// Define the language map for language_id
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

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const compileCode = async () => {
    setLoading(true);
    setOutput(null);

    try {
      // Get the language_id from the languageMap
      const language_id = languageMap[language.toLowerCase()];
      if (!language_id) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Send the POST request to the API
      const res = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code, // Use the code from props
          language_id, // Use the mapped language_id
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      // Parse the response
      const data = await res.json();
      setOutput(data.stdout || data.stderr || "No output available.");
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error executing code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-l border-gray-300 transition-all duration-300 w-full">
      <h3 className="text-green-400 mb-2">Code Editor</h3>

      {/* Monaco Editor */}
      <Editor
        height="70vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(newValue) => setCode(newValue || "")}
      />

      {/* Run Code Button */}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={compileCode}
        disabled={loading}
      >
        {loading ? "Compiling..." : "Run Code"}
      </button>

      {/* Output Section */}
      <div className="mt-4 p-3 bg-black text-white rounded">
        <h4 className="text-yellow-400">Output:</h4>
        <pre className="whitespace-pre-wrap">{output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;