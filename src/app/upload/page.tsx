"use client";

import AppShell from "@/components/app-shell";
import Header from "@/components/Header";
import MagicUploadCard from "@/components/VideoUploadForm";
import dynamic from "next/dynamic";

const VideoUploadForm = dynamic(() => import("@/components/VideoUploadForm"), {
  ssr: false,
});

export default function UploadPage() {
  return (
    <>
          <AppShell>    <main className="min-h-screen  flex flex-col items-center mt-10 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Upload Your Video
        </h1>
        <MagicUploadCard />
      </main></AppShell>
  \
    </>
  );
}
