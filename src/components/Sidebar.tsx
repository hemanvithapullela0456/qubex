"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FileManager from "./FileManager";

interface File {
  name: string;
  type: "file";
  language: string;
  content: string;
}

interface SidebarProps {
  onFileOpen: (file: File) => void;
  onFileRename: (oldName: string, newName: string) => void;
  onFileDelete: (fileName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onFileOpen,
  onFileRename,
  onFileDelete,
}) => {
  const pathname = usePathname();

  const features = [
    { name: "AI Bug Fixing & Code Completion", path: "/ai-bug-fixing" },
    { name: "Automated Test Case Generation", path: "/automated-test-cases" },
    { name: "AI Debugging Assistant", path: "/ai-debugging" },
    { name: "Code Refactoring Suggestions", path: "/code-refactoring" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Intelligent IDE</h2>

      {/* File Manager */}
      <FileManager
        onFileOpen={onFileOpen}
        onFileRename={onFileRename}
        onFileDelete={onFileDelete}
      />

      {/* Feature Selection */}
      <ul className="mt-4">
        {features.map((feature) => (
          <li key={feature.path} className="mb-2">
            <Link
              href={feature.path}
              className={`block p-2 rounded-lg transition-all duration-300 hover:bg-gray-700 ${
                pathname === feature.path ? "bg-gray-700" : ""
              }`}
            >
              {feature.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;