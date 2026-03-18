"use client";

import Link from "next/link";
import {
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Left */}
        <Link href="/" className="font-semibold text-white text-lg">
          Zoro AI
        </Link>

        {/* Center */}
        <div className="hidden md:block text-gray-400 text-sm">
          Cyber Security Assistant
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          <Link
            href="/aboutme"
            className="text-sm text-gray-300 hover:text-white transition"
          >
            About
          </Link>

          {!isSignedIn ? (
            <>
              {/* Sign In */}
              <SignInButton mode="modal">
                <button className="text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-gray-800 transition">
                  Sign In
                </button>
              </SignInButton>

              {/* Sign Up */}
              <SignUpButton mode="modal">
                <button className="text-sm px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
}