// components/ui/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Welcome Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              ZoraCyberSecurityAI
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/aboutme"
              className="relative group text-white text-3xl px-3 py-2 rounded-md transition-all duration-300 hover:text-blue-400 hover:scale-105"
            >
              About Me
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            {/* Optional: Add a hamburger menu here */}
          </div>
        </div>
      </div>
    </nav>
  );
}
