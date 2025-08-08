"use client"

import AppShell from "@/components/app-shell"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { getVideos } from "@/lib/mock-data"

export default function LibraryPage() {
  const all = getVideos()
  const [likes, setLikes] = useState<string[]>([])
  const [watchLater, setWatchLater] = useState<string[]>([])

  useEffect(() => {
    try {
      setLikes(JSON.parse(localStorage.getItem("likes") || "[]"))
      setWatchLater(JSON.parse(localStorage.getItem("watchLater") || "[]"))
    } catch {}
  }, [])

  const likedVideos = all.filter((v) => likes.includes(v.id))
  const savedVideos = all.filter((v) => watchLater.includes(v.id))

  return (
    <AppShell>
      <h1 className="mb-4 text-2xl font-semibold">Library</h1>
      <Tabs defaultValue="saved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saved">Watch Later</TabsTrigger>
          <TabsTrigger value="liked">Liked Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="saved">
          <VideoGridSimple videos={savedVideos} emptyText="No saved videos yet." />
        </TabsContent>
        <TabsContent value="liked">
          <VideoGridSimple videos={likedVideos} emptyText="No liked videos yet." />
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}

function VideoGridSimple({
  videos = [],
  emptyText = "No videos",
}: {
  videos?: ReturnType<typeof getVideos>
  emptyText?: string
}) {
  if (!videos.length) {
    return <div className="rounded-lg border p-8 text-center text-muted-foreground">{emptyText}</div>
  }
  return (
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
  )
}
