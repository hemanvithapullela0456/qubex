"use client";

import { useState, ReactElement, cloneElement } from "react";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/CodeEditor";
import AIBugFixing from "../app/ai-bug-fixing/page";
import "./globals.css";

interface File {
  name: string;
  type: "file";
  language: string;
  content: string;
}

interface FeatureComponentProps {
  selectedFile: File | null;
  onFileChange: (newContent: string) => void;
}

export default function RootLayout({ children }: { children: ReactElement<FeatureComponentProps> }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileOpen = (file: File) => {
    console.log("File opened:", file); // This confirms the file is being opened correctly
    setSelectedFile(file);
    if (!files.some((f) => f.name === file.name)) {
      setFiles((prevFiles) => [...prevFiles, file]);
    }
  };

  const handleFileRename = (oldName: string, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.name === oldName ? { ...file, name: newName } : file
      )
    );
    if (selectedFile?.name === oldName) {
      setSelectedFile({ ...selectedFile, name: newName });
    }
  };

  const handleFileDelete = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    if (selectedFile?.name === fileName) {
      setSelectedFile(null);
    }
  };

  const handleFileContentChange = (newContent: string) => {
    if (selectedFile) {
      setSelectedFile({ ...selectedFile, content: newContent });
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.name === selectedFile.name ? { ...file, content: newContent } : file
        )
      );
    }
  };

  const childrenWithProps = cloneElement(children, {
    selectedFile,
    onFileChange: handleFileContentChange,
  });

  return (
    <html lang="en">
      <body className="h-screen">
        <div className="flex h-full">
          <Sidebar
            onFileOpen={handleFileOpen}
            onFileRename={handleFileRename}
            onFileDelete={handleFileDelete}
          />
          <div className="flex-grow flex">
            {/* Feature Space (Left) */}
            <AIBugFixing selectedFile={selectedFile} onFileChange={handleFileContentChange} />
            
            {/* Code Editor (Right) */}
            <div className="w-3/4">
              {selectedFile ? (
                <CodeEditor
                  code={selectedFile.content}
                  setCode={handleFileContentChange}
                  language={selectedFile.language}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <p>No file selected. Open a file from the sidebar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
