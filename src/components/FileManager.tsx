"use client";

import { useState } from "react";

interface File {
  name: string;
  type: "file" | "folder";
  language?: string;
  content?: string;
  children?: File[];
}

interface FileManagerProps {
  onFileOpen: (file: { name: string; type: "file"; language: string; content: string }) => void;
  onFileRename: (oldName: string, newName: string) => void;
  onFileDelete: (fileName: string) => void;
}

// Initial files structure
const initialFiles: File = {
  name: "root",
  type: "folder",
  children: [
    { name: "index.js", type: "file", language: "javascript", content: "// JavaScript file" },
    { name: "hello.c", type: "file", language: "c", content: "#include <stdio.h>\nint main() {\n  printf(\"Hello\");\n}" },
    { name: "hello.cpp", type: "file", language: "cpp", content: "#include <iostream>\nint main() {\n  cout << \"hello\";\n}" }
  ],
};

const FileManager: React.FC<FileManagerProps> = ({
  onFileOpen,
  onFileRename,
  onFileDelete,
}) => {
  const [files, setFiles] = useState<File>(initialFiles);
  const [newFileName, setNewFileName] = useState<string>("");
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>("");

  const handleFileClick = (file: File) => {
    if (file.type === "file") {
      const language = file.language || "text";
      const content = file.content || "";
      onFileOpen({ name: file.name, type: "file", language, content });
    }
  };

  const handleAddFile = () => {
    if (newFileName.trim() === "") {
      alert("File name cannot be empty!");
      return;
    }

    const extension = newFileName.split(".").pop()?.toLowerCase();
    let language = "text"; // Default language
    if (extension === "js") language = "javascript";
    else if (extension === "cpp") language = "cpp";
    else if (extension === "c") language = "c";
    else if(extension === "py") language = "python";

    const newFile: File = {
      name: newFileName,
      type: "file",
      language,
      content: "", // Default empty content
    };

    const updatedFiles = {
      ...files,
      children: [...(files.children || []), newFile],
    };

    setFiles(updatedFiles);
    setNewFileName(""); // Clear the input field

    // Automatically open the new file in the CodeEditor
    onFileOpen({ name: newFileName, type: "file", language, content: "" });
  };

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = {
      ...files,
      children: files.children?.filter((file) => file.name !== fileName),
    };
    setFiles(updatedFiles);
    onFileDelete(fileName); // Notify parent component
  };

  const handleRenameFile = (fileName: string) => {
    setEditingFile(fileName);
    setTempFileName(fileName);
  };

  const handleSaveRename = (oldName: string) => {
    if (tempFileName.trim() === "") {
      alert("File name cannot be empty!");
      return;
    }

    const updatedFiles = {
      ...files,
      children: files.children?.map((file) =>
        file.name === oldName ? { ...file, name: tempFileName } : file
      ),
    };

    setFiles(updatedFiles);
    setEditingFile(null); // Disable editing mode
    setTempFileName(""); // Clear the temporary file name
    onFileRename(oldName, tempFileName); // Notify parent component
  };

  return (
    <div className="p-2">
      <h3 className="text-green-400">EDITOR</h3>

      {/* Add New File Input */}
      <div className="mb-4">
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file name"
          className="p-1 text-black rounded"
        />
        <button
          onClick={handleAddFile}
          className="ml-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add File
        </button>
      </div>

      {/* File Tree */}
      <ul className="text-green-300">
        <li>
          <span className="font-bold">root</span>
          <ul className="ml-4">
            {files.children?.map((file) => (
              <li
                key={file.name}
                className="cursor-pointer hover:text-green-500 flex items-center justify-between"
              >
                {/* File Name or Rename Input */}
                {editingFile === file.name ? (
                  <input
                    type="text"
                    value={tempFileName}
                    onChange={(e) => setTempFileName(e.target.value)}
                    onBlur={() => handleSaveRename(file.name)} // Save on blur
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename(file.name); // Save on Enter
                    }}
                    className="p-1 text-black rounded"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleFileClick(file)}>📄 {file.name}</span>
                )}

                {/* Rename and Delete Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRenameFile(file.name)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="text-red-400 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default FileManager;