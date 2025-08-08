"use client"

import AppShell from "@/components/app-shell"
import { getVideos } from "@/lib/mock-data"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function LikedPage() {
  const all = getVideos()
  const [likes, setLikes] = useState<string[]>([])

  useEffect(() => {
    try {
      setLikes(JSON.parse(localStorage.getItem("likes") || "[]"))
    } catch {}
  }, [])

  const videos = all.filter((v) => likes.includes(v.id))

  return (
    <AppShell>
      <h1 className="mb-4 text-2xl font-semibold">Liked videos</h1>
      {videos.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">No liked videos yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v) => (
            <Link href={`/watch/${v.id}`} key={v.id} className="group" prefetch={false}>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <img src={v.thumbnail || "/placeholder.svg"} alt={`${v.title} thumbnail`} className="h-full w-full object-cover" loading="lazy" />
                <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs text-white">
                  {v.duration}
                </span>
              </div>
              <div className="mt-3 flex gap-3">
                <img src={v.channel.avatar || "/placeholder.svg"} alt={`${v.channel.name} avatar`} className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-medium leading-snug">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.channel.name}</p>
                  <p className="text-xs text-muted-foreground">{v.meta}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  )
}
