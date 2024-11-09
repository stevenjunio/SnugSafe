import React from "react";

import { Button } from "@/components/ui/button";
import { Files, Share2, Settings, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/snugsafe-logo-horizontal.png";
import { useCorbado } from "@corbado/react";

export function LoggedInFrameComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { logout } = useCorbado();

  const navItems = [
    { name: "Files", icon: Files, href: "/files" },
    { name: "File Sharing", icon: Share2, href: "/sharing" },
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Team", icon: Users, href: "/team" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Sidebar */}
      <nav className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <img src={logo} alt="SnugSafe Logo" width={200} />
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${pathname === item.href ? "text-primary bg-gray-200" : "text-gray-600 bg-transparent"} hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
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
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
