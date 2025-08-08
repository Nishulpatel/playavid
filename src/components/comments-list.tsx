"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

type Comment = {
  id: string
  text: string
  at: number
}

function readComments(videoId: string): Comment[] {
  try {
    const raw = localStorage.getItem(`comments:${videoId}`)
    return raw ? (JSON.parse(raw) as Comment[]) : []
  } catch {
    return []
  }
}
function writeComments(videoId: string, comments: Comment[]) {
  try {
    localStorage.setItem(`comments:${videoId}`, JSON.stringify(comments))
  } catch {}
}

export default function CommentsList({ videoId = "" }: { videoId?: string }) {
  const [items, setItems] = useState<Comment[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    setItems(readComments(videoId))
  }, [videoId])

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const c: Comment = { id: Math.random().toString(36).slice(2), text: text.trim(), at: Date.now() }
    const updated = [c, ...items]
    setItems(updated)
    writeComments(videoId, updated)
    setText("")
  }
  const remove = (id: string) => {
    const updated = items.filter((c) => c.id !== id)
    setItems(updated)
    writeComments(videoId, updated)
  }

  return (
    <div>
      <form onSubmit={add} className="flex gap-2 border-b p-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" />
        <Button type="submit">Post</Button>
      </form>
      <ul className="divide-y">
        {items.map((c) => (
          <li key={c.id} className="flex items-start gap-3 p-3">
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">U</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Guest</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(c.at), { addSuffix: true })}</span>
              </div>
              <p className="mt-1 text-sm">{c.text}</p>
              <div className="mt-1">
                <Button variant="ghost" size="sm" onClick={() => remove(c.id)} className="h-7 px-2 text-xs">
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Be the first to comment.</li>}
      </ul>
    </div>
  )
}
