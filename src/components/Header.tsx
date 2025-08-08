"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Home, Upload, LogOut, LogIn, Menu, Search } from "lucide-react";
import { useNotification } from "./Notification";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Authenticated nav links
const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
];

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    session?.user?.email?.[0]?.toUpperCase() ||
    "?";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      showNotification(`Searching for "${query}"`, "info");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4">
        {/* Left section: Mobile Menu + Logo */}
        <div className="flex items-center gap-2">


          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            prefetch={false}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-16 rounded"
            />
            <span className="hidden sm:inline">PlayaVid</span>
          </Link>

        </div>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden min-w-0 flex-1 items-center sm:flex"
        >
          <div className="relative mx-auto w-full max-w-xl">
            <Input
              name="q"
              aria-label="Search"
              placeholder="Search videos"
              className="w-full pl-9"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </form>

        {/* Right section */}

        <div className="flex items-center gap-2">

                    {/* sidebar open */}
          <div className="md:hidden ">
          {session && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>PlayaVid</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-1">
                  {navLinks.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                          active && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                          setOpen(false);
                          showNotification(`Navigating to ${item.label}`, "info");
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          </div>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full p-0"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  >
                    {initials}
                  </span>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="max-w-[240px]">
                  <div className="truncate">{session.user?.name || "User"}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {session.user?.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  {/* <Link
                    href={`/profile/${(session.user?.name || "").toLowerCase()}`}>
                    Your channel
                  </Link> */}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <span className="hidden sm:block text-sm text-gray-600">
                Sign in to upload your video
              </span>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link
                  href="/login"
                  onClick={() =>
                    showNotification("Please sign in to continue", "info")
                  }
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="container mx-auto px-4 pb-3 sm:hidden hidden">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input name="q" placeholder="Search videos" className=" pl-9" />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </form>
      </div>
    </header>
  );
}
