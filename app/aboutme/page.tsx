"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaBriefcase } from "react-icons/fa";

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-4 sm:px-6 md:px-20 py-16 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-6xl relative z-10">
        {/* Left Section - Text */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Welcome to the <br />
            World of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Raxit Zora
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium">
            Full Stack Engineer | Cyber Security Enthusiast | AI Innovator
          </p>

          {/* Buttons Row */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition-all duration-300">
              ▶ Connect Now
            </button>
            <a
              href="/raxitzoraResume.pdf"
              download
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-6 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition-all duration-300"
            >
              📄 Download Resume
            </a>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex justify-center">
          <div className="relative">
            <Image
              src="/rax.jpg"
              alt="Raxit Zora"
              width={400}
              height={400}
              className="rounded-2xl object-cover border-2 border-cyan-500/30 hover:border-cyan-500 transition-all duration-300"
              priority
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-20 w-full max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          🎓 Education
        </h2>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">
            Harivandana College
          </h3>
          <p className="text-gray-300 text-base sm:text-lg">
            Pursuing {" "}
            <span className="font-medium text-white">
              Bachelor of Computer Applications (BCA)
            </span>
          </p>
          <p className="text-gray-400 text-sm sm:text-base mt-2">2023 - 2026</p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mt-20 w-full max-w-4xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          💼 Experience
        </h2>
        <div className="space-y-6">
          {/* Experience 1 */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <FaBriefcase className="text-cyan-400 text-2xl sm:text-3xl" />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">
                  Unified Mentor
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  Machine Learning Engineer
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  January 2025 - February 2025
                </p>
              </div>
            </div>
          </div>

          {/* Experience 2 */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <FaBriefcase className="text-purple-400 text-2xl sm:text-3xl" />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">
                  Deckoid Solution
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  Full Stack Engineer
                </p>
                <p className="text-gray-400 text-sm mt-1">July 2025 - Present</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Me Section */}
      <div className="mt-20 w-full max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          🤝 Connect With Me
        </h2>
        <div className="flex justify-center gap-6 sm:gap-8">
          <a
            href="https://github.com/raxitzora"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-cyan-400 transition-all duration-300"
          >
            <FaGithub className="w-12 h-12 sm:w-16 sm:h-16" />
          </a>
          <a
            href="https://www.linkedin.com/in/raxit-zora-2a684129b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-500 transition-all duration-300"
          >
            <FaLinkedin className="w-12 h-12 sm:w-16 sm:h-16" />
          </a>
          <a
            href="https://www.instagram.com/raxit.zora/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-pink-500 transition-all duration-300"
          >
            <FaInstagram className="w-12 h-12 sm:w-16 sm:h-16" />
          </a>
        </div>
      </div>
    </div>
  );
}