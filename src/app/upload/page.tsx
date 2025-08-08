"use client";

import { useSession, signIn } from "next-auth/react";
import AppShell from "@/components/app-shell";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const MagicUploadCard = dynamic(() => import("@/components/VideoUploadForm"), {
  ssr: false,
});

export default function UploadPage() {
  const { data: session, status } = useSession();

  // Optional: loading state while session is being fetched
  if (status === "loading") {
    return (
      <AppShell>
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="min-h-screen flex flex-col items-center mt-10 px-4 md:px-6">


        {session ? (
          <div>
                       <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Upload Your Video
        </h1>
                <MagicUploadCard />
          </div>
      
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-gray-600">Sign in to upload videos</p>
            <Button
              onClick={() => signIn()}
              className="px-4 py-2 "
            >
              Sign In
            </Button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
