import { formatShortNumber, timeAgo } from "./format"


export type Channel = {
  id: string
  name: string
  handle: string
  avatar: string
  subscribers: number
  bio: string
}

export type Video = {
  id: string
  title: string
  description: string
  src: string
  thumbnail: string
  duration: string
  channel: Channel
  views: number
  createdAt: string
  category: string
  tags: string[]
  meta: string
}

const channels: Channel[] = [
  {
    id: "c1",
    name: "Aurora Labs",
    handle: "aurora",
    avatar: "/placeholder.svg?height=80&width=80",
    subscribers: 1284000,
    bio: "Exploring the intersection of code, creativity, and the cosmos.",
  },
  {
    id: "c2",
    name: "Daily Dev",
    handle: "dailydev",
    avatar: "/placeholder.svg?height=80&width=80",
    subscribers: 804000,
    bio: "Tips, tricks, and tutorials for modern developers.",
  },
  {
    id: "c3",
    name: "Cityscapes",
    handle: "cityscapes",
    avatar: "/placeholder.svg?height=80&width=80",
    subscribers: 423000,
    bio: "Aerials and vibes from cities around the world.",
  },
]

const baseVideos: Omit<Video, "id" | "meta">[] = [
  {
    title: "Next.js 15: What's New and How to Upgrade",
    description: "In this video we cover the latest features in Next.js 15 and how to upgrade safely.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "12:34",
    channel: channels[1],
    views: 124523,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    category: "Education",
    tags: ["nextjs", "react", "webdev"],
  },
  {
    title: "City Night Drive 4K - Relaxing Ambient",
    description: "Relax and enjoy a stunning night drive through a neon city in 4K.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "1:02:20",
    channel: channels[2],
    views: 955324,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    category: "Lifestyle",
    tags: ["relax", "ambient", "city"],
  },
  {
    title: "TypeScript Tips You Wish You Knew Sooner",
    description: "Power tips for day-to-day TypeScript that will level up your codebase.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "9:48",
    channel: channels[1],
    views: 60321,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: "Education",
    tags: ["typescript", "tips"],
  },
  {
    title: "Aurora Over Iceland - Real Time",
    description: "Captured over the fjords of Iceland. No music, just nature.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "24:03",
    channel: channels[0],
    views: 2201543,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
    category: "Travel",
    tags: ["nature", "iceland", "aurora"],
  },
  {
    title: "Build a Modern UI with Tailwind CSS",
    description: "Design faster with utility classes. We walk through a real-world layout.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "18:05",
    channel: channels[1],
    views: 185402,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    category: "Education",
    tags: ["ui", "css", "tailwind"],
  },
]

const more: typeof baseVideos = [
  {
    title: "Drone Tour: Tokyo at Dawn",
    description: "Soar above Tokyo during the blue hour. Captured in 6K.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "7:25",
    channel: channels[2],
    views: 740223,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    category: "Travel",
    tags: ["travel", "city", "drone"],
  },
  {
    title: "CSS Animations: The Missing Guide",
    description: "Everything you need to craft silky-smooth animations.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "14:10",
    channel: channels[1],
    views: 12450,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    category: "Education",
    tags: ["css", "animation"],
  },
  {
    title: "Timelapse: Building a Cabin in the Woods",
    description: "From foundation to finish in under 20 minutes.",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    duration: "19:54",
    channel: channels[0],
    views: 331220,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    category: "Lifestyle",
    tags: ["build", "diy"],
  },
]

const videosRaw = [...baseVideos, ...more].map((v, idx) => {
  const id = `v${idx + 1}`
  const meta = `${formatShortNumber(v.views)} views • ${timeAgo(v.createdAt)}`
  return { ...v, id, meta }
})

export function getVideos(): Video[] {
  return videosRaw
}
export function getVideoById(id: string): Video | undefined {
  return videosRaw.find((v) => v.id === id)
}
export function getRelatedVideos(id: string): Video[] {
  const current = getVideoById(id)
  if (!current) return getVideos()
  const sameCat = videosRaw.filter((v) => v.category === current.category && v.id !== id)
  const others = videosRaw.filter((v) => v.category !== current.category)
  return [...sameCat, ...others]
}
export function getAllCategories(): string[] {
  const set = new Set<string>(["All"])
  for (const v of videosRaw) set.add(v.category)
  return Array.from(set)
}
export function getVideosByCategory(category: string): Video[] {
  return videosRaw.filter((v) => v.category === category)
}
export function searchVideos(q: string): Video[] {
  const s = q.toLowerCase()
  return videosRaw.filter(
    (v) =>
      v.title.toLowerCase().includes(s) ||
      v.description.toLowerCase().includes(s) ||
      v.tags.some((t) => t.toLowerCase().includes(s)) ||
      v.channel.name.toLowerCase().includes(s)
  )
}
export function getChannelByHandle(handle: string): Channel | undefined {
  return channels.find((c) => c.handle.toLowerCase() === handle.toLowerCase())
}
export function getVideosByChannel(channelId: string): Video[] {
  return videosRaw.filter((v) => v.channel.id === channelId)
}
