"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                ZoroAICyberSec
              </span>
            </Link>
          </div>

          {/* Center Text */}
          <div className="hidden sm:flex flex-1 justify-center">
            <span className="text-3xl font-bold text-yellow-500  duration-300">
              Welcome to Unfiltered CyberSpace
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/aboutme"
              className="relative text-gray-200 text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50 hover:text-blue-400 hover:scale-105 backdrop-blur-sm group"
            >
              About Me
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-200 p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out transform ${
            isOpen
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gray-800/80 backdrop-blur-md rounded-b-lg">
            <Link
              href="/aboutme"
              className="block text-gray-200 text-lg font-medium px-4 py-3 rounded-lg hover:bg-gray-700/50 hover:text-blue-400 transition-all duration-200"
              onClick={toggleMenu}
            >
              About Me
            </Link>
            <Link
              href="/contact"
              className="block text-gray-200 text-lg font-medium px-4 py-3 rounded-lg hover:bg-gray-700/50 hover:text-blue-400 transition-all duration-200"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
