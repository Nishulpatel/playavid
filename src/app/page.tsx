// app/page.tsx

import VideoFeed from "@/components/VideoFeed";
import { IVideo } from "@/models/Videos";
import Header from "@/components/Header";

export default async function HomePage() {
  // Fetch video data from internal API route
  const res = await fetch(` ${process.env.NEXTAUTH_URL}/api/videos`, {
    cache: "no-store", // always get fresh data
  });

  if (!res.ok) {
    // fallback if fetch fails
    return (
      <>
        <Header />
        <main className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Explore Videos</h1>
          <p className="text-error">Failed to load videos.</p>
        </main>
      </>
    );
  }

  const videos: IVideo[] = await res.json();

  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Explore Videos</h1>
        <VideoFeed videos={videos} />
      </main>
    </>
  );
}
