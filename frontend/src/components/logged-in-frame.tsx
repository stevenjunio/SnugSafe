import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Files, Share2, Settings, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/snug-safe-word-logo.webp";
import { useCorbado } from "@corbado/react";
import { Spinner } from "./ui/spinner";

export function LoggedInFrameComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { logout } = useCorbado();
  const [username, setUsername] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInfo = useCorbado();
  userInfo.getFullUser().then((user) => {
    if ("identifiers" in user.val) {
      console.log(`user from full user`, user.val.identifiers[0].value);
      setUsername(user.val.identifiers[0].value);
    } else {
      console.error("Error fetching user information", user);
    }
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Username copied to clipboard!");
  };

  const navItems = [
    { name: "Files", icon: Files, href: "/files", active: true },
    { name: "File Sharing", icon: Share2, href: "/sharing", active: true },
    { name: "Settings", icon: Settings, href: "/settings", active: false },
    { name: "Team", icon: Users, href: "/team", active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-100  dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed p-4">
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
          <Button className=" md:hidden ml-6" onClick={toggleMobileMenu}>
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
          <h3
            className={`mb-2 text-center text-[#C586A1] font-extrabold uppercase`}
          >
            {username ? (
              <span
                className="cursor-pointer hover:underline"
                onClick={() => copyToClipboard(username)}
              >
                {username}
              </span>
            ) : (
              <div className="min-h-6"></div>
            )}
          </h3>

          <Spinner className="h-2" />

          <ul className="mt-2 space-y-2">
            {navItems.map((item) => {
              if (item.active) {
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${pathname === item.href ? "text-primary bg-gray-200" : "text-gray-600 bg-transparent"} hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 `}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 mt-10 md:mt-0">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
