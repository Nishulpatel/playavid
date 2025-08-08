"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Menu, Search, Upload, Library, History, Flame, Home, ThumbsUp, User, LogIn, LogOut, Settings, Contact } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import Header from "./Header"

export default function AppShell({
  children = null,
}: {
  children?: React.ReactNode
}) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const initials = useMemo(() => (user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "GU"), [user])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null")
      setUser(u)
    } catch {}
  }, [])

  const nav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload},
    // { href: "/trending", label: "Trending", icon: Flame },
    // { href: "/subscriptions", label: "Subscriptions", icon: User },
    // { href: "/library", label: "Library", icon: Library },
    // { href: "/history", label: "History", icon: History },
    // { href: "/liked", label: "Liked", icon: ThumbsUp },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "https://www.nishul.dev", label: "Contact", icon: Contact },
  ]

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const q = String(form.get("q") || "").trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
  }

  const signOut = () => {
    localStorage.removeItem("user")
    window.location.reload()
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col">
    <Header />

      <main className="container mx-auto flex w-full flex-1 gap-6 px-4 py-6">
        {/* desktop sidebar */}
        <aside className="sticky top-[4.25rem] hidden h-[calc(100dvh-4.25rem)] w-56 shrink-0 overflow-auto rounded-lg border p-2 md:block">
          <nav className="grid gap-1">
            {nav.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                    active && "bg-accent text-accent-foreground"
                  )}
                  prefetch={false}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </main>

      <footer className="mt-auto border-t">
        <div className="container mx-auto flex h-12 items-center justify-between px-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PlayaVid</p>
          <p className="hidden sm:block">Developed with ❤️ by Nishul</p>
        </div>
      </footer>
    </div>
  )
}
