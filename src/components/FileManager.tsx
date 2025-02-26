"use client";

import { useState } from "react";
import { FaFolder, FaFolderOpen, FaFile, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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
  sidebarOpen: boolean;
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
  sidebarOpen,
}) => {
  const [files, setFiles] = useState<File>(initialFiles);
  const [newFileName, setNewFileName] = useState<string>("");
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>("");

  const handleFileClick = (file: File) => {
    if (file.type === "file") {
      const language = file.language?.toLowerCase() || "text";
      onFileOpen({ name: file.name, type: "file", language, content: file.content || "" });
    }
  };

  const handleAddFile = () => {
    if (newFileName.trim() === "") {
      alert("File name cannot be empty!");
      return;
    }

    const extension = newFileName.split(".").pop()?.toLowerCase();
    let language = "text";
    if (extension === "js") language = "javascript";
    else if (extension === "cpp") language = "cpp";
    else if (extension === "c") language = "c";
    else if (extension === "py") language = "python";

    const newFile: File = {
      name: newFileName,
      type: "file",
      language,
      content: "",
    };

    setFiles({
      ...files,
      children: [...(files.children || []), newFile],
    });

    setNewFileName("");
    onFileOpen({ name: newFileName, type: "file", language, content: "" });
  };

  const handleDeleteFile = (fileName: string) => {
    setFiles({
      ...files,
      children: files.children?.filter((file) => file.name !== fileName),
    });
    onFileDelete(fileName);
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

    setFiles({
      ...files,
      children: files.children?.map((file) =>
        file.name === oldName ? { ...file, name: tempFileName } : file
      ),
    });

    setEditingFile(null);
    setTempFileName("");
    onFileRename(oldName, tempFileName);
  };

  return (
    <div className={`p-2 ${sidebarOpen ? "w-76" : "w-12"} transition-all duration-300 flex flex-col`}>
      {sidebarOpen ? (
        <>
          {/* Sidebar Open: Show Full File List */}
          <div className="bg-[#161b22] border-b border-[#21262d] pl-6 pr-4
           pt-4 pb-4 mb-4">
        <div className="flex items-center gap-2 text-green-400">
          <FaFolderOpen className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Editor</h2>
        </div>
      </div>

          {/* Add New File Input */}
          <div className="flex items-center mt-2 gap-2 px-5">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="New file name"
              className="p-1 text-black rounded w-full"
            />
            <button
              onClick={handleAddFile}
              className="p-1 bg-blue-600 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <FaPlus />
            </button>
          </div>

          {/* File List */}
          <ul className="mt-2 w-full px-5">
            {files.children?.map((file) => (
              <li key={file.name} className="flex items-center justify-between py-1">
                {/* File Click */}
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
                  onClick={() => handleFileClick(file)}
                >
                  <FaFile /> {editingFile === file.name ? (
                    <input
                      type="text"
                      value={tempFileName}
                      onChange={(e) => setTempFileName(e.target.value)}
                      onBlur={() => handleSaveRename(file.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(file.name);
                      }}
                      className="p-1 text-black rounded"
                    />
                  ) : (
                    file.name
                  )}
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex gap-2">
                  <FaEdit
                    className="cursor-pointer text-yellow-400 hover:text-yellow-500"
                    onClick={() => handleRenameFile(file.name)}
                  />
                  <FaTrash
                    className="cursor-pointer text-red-400 hover:text-red-500"
                    onClick={() => handleDeleteFile(file.name)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        /* Sidebar Collapsed: Show Only Root Folder */
        <div className="text-blue-400 text-xl flex justify-center">
          <FaFolder />
        </div>
      )}
    </div>
  );
};

export default FileManager;