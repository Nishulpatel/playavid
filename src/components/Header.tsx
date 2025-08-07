"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Upload, LogOut, LogIn } from "lucide-react";
import { useNotification } from "./Notification";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Navigation links array for authenticated users
const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
];

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="border-b bg-white border-gray-200 px-4 md:px-6 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger - only show if authenticated */}
          {session && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="group size-8 md:hidden text-gray-300 hover:text-white"
                  variant="ghost"
                  size="icon"
                >
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden bg-black border-gray-800">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="flex w-full">
                        <NavigationMenuLink
                          asChild
                          className="py-1.5 text-gray-600 hover:text-white hover:bg-neutral-700 w-full flex items-center gap-2"
                        >
                          <Link
                            href={link.href}
                            onClick={() =>
                              showNotification(`Navigating to ${link.label}`, "info")
                            }
                          >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          )}

          {/* Main nav */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation menu - only show if authenticated */}
            {session && (
              <NavigationMenu className="max-md:hidden">
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        asChild
                        className="text-gray-600  hover:bg-neutral-200 py-1.5 px-3 font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <Link
                        className="text-gray-600 hover:bg-neutral-200 py-1.5 px-3 font-medium transition-colors duration-200 flex items-center gap-2"
                          href={link.href}
                          onClick={() =>
                            showNotification(`Navigating to ${link.label}`, "info")
                          }
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* User info and menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-gray-600 hover:bg-neutral-200 gap-2 "
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block max-w-32 truncate">
                      {session.user?.email?.split("@")[0]}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-2 bg-neutral-700 border-gray-800">
                  <div className="space-y-2">
                    {/* User info */}
                    <div className="px-2 py-2 border-b border-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br  rounded-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {session.user?.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-gray-400">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sign out button */}
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm text-gray-300 hover:text-red-400 hover:bg-red-900/20 gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
            <div className=" flex justify-center">
                   Sign in to upload your video
            </div>
    
              {/* Sign in button */}
              <Button asChild variant="ghost" size="sm" className="text-sm text-gray-600  hover:bg-gray-200">
                <Link
                  href="/login"
                  onClick={() =>
                    showNotification("Please sign in to continue", "info")
                  }
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}