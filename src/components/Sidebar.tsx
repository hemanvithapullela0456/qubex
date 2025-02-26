"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AiOutlineCode, AiOutlineSetting } from "react-icons/ai";
import { BsFileEarmarkCode, BsChevronLeft, BsChevronRight, BsFolder } from "react-icons/bs";
import { Bug } from "lucide-react";
interface SidebarProps {
  setActiveFeature: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveFeature }) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const features = [
    { name: "AI Debugging", path: "/ai-bug-fixing", icon: <Bug size={28} /> },
    { name: "Test Cases", path: "/automated-test-cases", icon: <BsFileEarmarkCode size={28} /> },
    { name: "Refactoring", path: "/code-refactoring", icon: <AiOutlineSetting size={28} /> },
  ];

  return (
    <div
      className={`h-screen bg-[#223843] text-white p-4 flex flex-col transition-all duration-300 relative border-r border-gray-700 shadow-lg font-roboto ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className=" z-50 absolute -right-5 top-5 bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600 transition-all shadow-md"
      >
        {isExpanded ? <BsChevronLeft size={24} /> : <BsChevronRight size={24} />}
      </button>

      {/* Sidebar Header with Logo */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <Image src="/image.png" alt="Qubex Logo" width={54} height={54} className="rounded-md" />
        {isExpanded && <h2 className="text-[28px] font-bold">Qubex</h2>}
      </div>

      {/* File Manager (Now same spacing as features) */}
      <ul className="space-y-1">
        <li>
          <button
            className="flex items-center gap-4 w-full text-left p-3 rounded-lg transition-all duration-300 hover:bg-gray-700"
            onClick={() => setActiveFeature("file-manager")}
          >
            <BsFolder size={28} />
            {isExpanded && <span className="text-lg">File Manager</span>}
          </button>
        </li>

        {/* Feature List */}
        {features.map((feature) => (
          <li key={feature.path}>
            <button
              className={`flex items-center gap-4 w-full text-left p-3 rounded-lg transition-all duration-300 hover:bg-gray-700 ${
                pathname === feature.path ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveFeature(feature.path)}
            >
              {feature.icon}
              {isExpanded && <span className="text-lg">{feature.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
