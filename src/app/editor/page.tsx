"use client";

import { useState} from "react";
import Sidebar from "../../components/Sidebar";
import CodeEditor from "../../components/CodeEditor";
import FileManager from "../../components/FileManager";
import AIBugFixing from "../ai-bug-fixing/_components/AiBugFixing"; 
import AIUnitTest from "../ai-test-generation/page";
import AICodeRefactoring from "../ai-code-refactoring/page";
import { FaTimes } from "react-icons/fa";
import "../globals.css";

interface File {
  name: string;
  type: "file";
  language: string;
  content: string;
}

export default function IDELayout() {
  const [openFiles, setOpenFiles] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleFileOpen = (file: File) => {
    if (!openFiles.some((f) => f.name === file.name)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
  };

  const handleCloseFile = (fileName: string) => {
    const updatedFiles = openFiles.filter((file) => file.name !== fileName);
    setOpenFiles(updatedFiles);

    if (activeFile?.name === fileName) {
      setActiveFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
    }
  };

  const handleFileContentChange = (newContent: string) => {
    if (activeFile) {
      setActiveFile({ ...activeFile, content: newContent });
      setOpenFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.name === activeFile.name ? { ...file, content: newContent } : file
        )
      );
    }
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case "/ai-bug-fixing":
        return <AIBugFixing selectedFile={activeFile} onFileChange={handleFileContentChange} />;
      case "/automated-test-cases":
        return <AIUnitTest selectedFile={activeFile} />;
      case "/ai-code-refactoring":
        return <AICodeRefactoring selectedFile={activeFile} />;
      case "file-manager":
        return <FileManager onFileOpen={handleFileOpen} onFileRename={() => {}} onFileDelete={() => {}} sidebarOpen={true} />;
      default:
        return (
          <div className="text-gray-400 flex items-center justify-center h-full">
            <p>Select a feature from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <Sidebar setActiveFeature={setActiveFeature} />

      {/* Feature Space (Left) */}
      <div className="w-1/4 min-w-0 flex flex-col bg-[#161b22] overflow-hidden">
        {renderFeature()}
      </div>

      {/* Code Editor (Right) */}
      <div className="w-3/4 min-w-0 flex flex-col overflow-hidden">
        <div className="bg-[#161b22] text-gray-300 flex overflow-x-auto whitespace-nowrap">
          {openFiles.map((file) => (
            <div
              key={file.name}
              className={`px-4 py-2 border-b-2 cursor-pointer flex items-center ${
                activeFile?.name === file.name ? "border-green-400 bg-[#21262d]" : "border-transparent"
              }`}
              onClick={() => setActiveFile(file)}
            >
              {file.name}
              <button
                className="ml-2 text-gray-400 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFile(file.name);
                }}
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-[#0d1117] border-t border-[#21262d] relative overflow-hidden">
          {activeFile ? (
            <CodeEditor
              code={activeFile.content}
              setCode={handleFileContentChange}
              language={activeFile.language}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No file selected. Open a file from the sidebar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
