"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Welcome Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                CyberSecAI
              </h1>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/aboutme"
              className="relative group text-white text-lg px-3 py-2 rounded-md transition-all duration-300 hover:text-blue-400 hover:scale-105"
            >
              About Me
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
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
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/aboutme"
              className="block text-white text-base px-3 py-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-all duration-200"
              onClick={toggleMenu}
            >
              About Me
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}