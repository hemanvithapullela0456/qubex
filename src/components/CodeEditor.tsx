"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icons for light and dark themes

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
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // Theme state

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const compileCode = async () => {
    if (!code.trim()) {
      alert("Code cannot be empty!");
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      const language_id = languageMap[language.toLowerCase()];
      if (!language_id) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const res = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code, language_id }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setOutput(data.stdout || data.stderr || "No output available.");
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error executing code.");
    } finally {
      setLoading(false);
    }
  };

  // const runGeneratedTestCases = async () => {
  //   if (!generatedTests.length) {
  //     alert("No AI-generated test cases available.");
  //     return;
  //   }

  //   setLoading(true);
  //   setOutput(null);

  //   try {
  //     let combinedOutput = "";

  //     for (const testCase of generatedTests) {
  //       const language_id = languageMap[language.toLowerCase()];
  //       if (!language_id) throw new Error(`Unsupported language: ${language}`);

  //       const res = await fetch("/api/execute-code", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ source_code: testCase, language_id }),
  //       });

  //       if (!res.ok) throw new Error(`Server error: ${res.status}`);

  //       const data = await res.json();
  //       combinedOutput += `Test Case Output:\n${data.stdout || data.stderr || "No output"}\n\n`;
  //     }

  //     setOutput(combinedOutput);
  //   } catch (error) {
  //     console.error("Error executing test cases:", error);
  //     setOutput("Error executing test cases.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className={`p-4 border-l transition-all duration-300 w-full h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Theme Toggle Button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-green-400">Code Editor</h3>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="50vh" // Adjusted height to fit within the screen
          language={language === "c" ? "c" : language === "cpp" ? "cpp" : language}
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          value={code}
          onChange={(newValue) => setCode(newValue || "")}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${theme === "light" ? "shadow-lg" : ""}`}
          onClick={compileCode}
          disabled={loading}
        >
          {loading ? "Compiling..." : "Run Code"}
        </button>

        <button
          className={`p-2 bg-green-500 text-white rounded hover:bg-green-600 ${theme === "light" ? "shadow-lg" : ""}`}
        >
          Execute AI Test Cases
        </button>
      </div>

      {/* Output Section */}
      <div className={`mt-4 p-3 rounded bg-black text-white flex-1`}>
        <h4 className="text-yellow-400">Output:</h4>
        <pre className="whitespace-pre-wrap">{output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;