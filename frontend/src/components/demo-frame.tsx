import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Files, AlertCircle, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/snug-safe-word-logo.webp";

export function DemoFrameComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed p-4 z-20">
        <Button onClick={toggleMobileMenu}>
          <span className="sr-only">Open Menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </Button>
      </div>

      {/* Navigation Sidebar */}
      <nav
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute md:relative z-10 h-full`}
      >
        <div className="flex justify-self-center items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 p-4 md:p-0">
          <Link to="/" className="mx-auto">
            <img src={logo} alt="SnugSafe Logo" width={200} />
          </Link>
          <Button className="md:hidden ml-6" onClick={toggleMobileMenu}>
            <span className="sr-only">Close Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </Button>
        </div>
        <div className="p-4">
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              Demo Mode
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Your files are stored temporarily in your browser.
            </p>
          </div>

          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary bg-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Files className="mr-2 h-4 w-4" />
                  Files
                </Button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="mr-2 h-4 w-4" />
              Exit Demo
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Persistent Signup Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-white" />
              <span className="text-sm font-medium">
                You're in demo mode. Sign up to save your files permanently!
              </span>
            </div>
            <Link to="/auth/signup">
              <Button
                variant="secondary"
                size="sm"
                className="ml-4 bg-white text-purple-600 hover:bg-gray-100"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 mt-10 md:mt-0">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
