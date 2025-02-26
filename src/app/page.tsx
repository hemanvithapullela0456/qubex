"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import "./globals.css";

const FeatureCard = ({ title, description, videoSrc }: { title: string; description: string; videoSrc: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto px-6 md:px-12"
    >
      <div className="lg:w-1/2 text-center lg:text-left">
        <h3 className="text-3xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 mt-3 text-lg">{description}</p>
      </div>
      <div className="lg:w-1/2">
        <video src={videoSrc} className="w-full max-w-lg lg:max-w-xl rounded-lg shadow-lg" autoPlay loop muted />
      </div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "start center"]
  });
  
  const textColor = useTransform(scrollYProgress, [0, 1], ["#6b7280", "#ffffff"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main className="w-full min-h-screen bg-[#0d1117] text-white font-roboto">
      {/* 🚀 Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-red-400 text-transparent bg-clip-text"
        >
          Code Faster. Fix Smarter.  
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-purple-400 text-transparent bg-clip-text mt-3"
        >
          Welcome to Qubex
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-300 mt-4 max-w-3xl"
        >
          The <strong>AI-driven</strong> Intelligent IDE that enhances your coding experience with  
          <strong> debugging</strong>, <strong>auto-completion</strong>, and <strong>test case generation</strong>.
        </motion.p>

        {/* ✨ Start Using Qubex Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={() => router.push("/editor")}
          className="mt-6 px-6 py-3 bg-blue-400 hover:bg-purple-400 text-white font-semibold text-lg rounded-lg shadow-lg transition-all"
        >
          Start Using Qubex
        </motion.button>
      </section>

      {/* ℹ️ About Section with Scroll Effect */}
      <section ref={aboutRef} className="w-full py-20 px-6 md:px-12 bg-[#161b22] relative">
        {/* Scroll Progress Line */}
        <motion.div
          style={{ width: lineWidth }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 bg-blue-400"
        />
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            style={{ color: textColor }}
            className="text-4xl font-bold"
          >
            What is <span className="text-blue-400">Qubex</span>?
          </motion.h2>
          <motion.p
            style={{ color: textColor }}
            className="text-lg md:text-xl mt-6 max-w-4xl mx-auto"
          >
            Qubex is an AI-powered IDE that helps developers write better code, faster.  
            With features like automated bug fixing, test case generation, and real-time AI assistance,  
            Qubex is designed to enhance your **productivity and efficiency.
          </motion.p>
        </div>
      </section>

      {/* ✨ Features Section with Scroll Effect */}
      <section ref={featuresRef} id="feature-section" className="w-full py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            style={{ color: textColor }}
            className="text-4xl text-center font-bold"
          >
            Features of Qubex
          </motion.h2>

          <div className="mt-16 space-y-16">
            <FeatureCard
              title="⚡ AI-Powered Code Assistance"
              description="Qubex provides real-time AI suggestions, improving your code quality and efficiency."
              videoSrc="/ggh1.mp4"
            />
            <FeatureCard
              title="🛠️ Automated Test Case Generation"
              description="Instantly generate test cases to validate your functions across multiple scenarios."
              videoSrc="/ggh2.mp4"
            />
            <FeatureCard
              title="🔍 Smart Debugging & Refactoring"
              description="Identify errors and optimize your code structure with AI-driven insights."
              videoSrc="/ggh3.mp4"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
