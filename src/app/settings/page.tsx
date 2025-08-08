"use client"

import AppShell from "@/components/app-shell"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      setName(user?.name || "")
      setEmail(user?.email || "")
      setDark(document.documentElement.classList.contains("dark"))
    } catch {}
  }, [])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const user = { name, email }
    localStorage.setItem("user", JSON.stringify(user))
    alert("Settings saved (demo)")
  }

  const toggleDark = (val: boolean) => {
    setDark(val)
    document.documentElement.classList.toggle("dark", val)
  }

  return (
    <AppShell>
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      <form onSubmit={save} className="max-w-xl space-y-6 rounded-lg border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label>Dark mode</Label>
            <p className="text-sm text-muted-foreground">Switch the theme</p>
          </div>
          <Switch checked={dark} onCheckedChange={toggleDark} />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </AppShell>
  )
}
