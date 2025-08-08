"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import { useState } from "react";
import FileUpload from "./FileUpload";
import { useNotification } from "./Notification";
import { UploadResponse } from "@imagekit/next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MagicUploadCard() {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const { showNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleUploadSuccess = async (res: UploadResponse) => {
    const videoTitle = title.trim() || "Untitled Video";
    const videoDescription = description.trim() || "No description";

    showNotification("Video uploaded successfully!", "success");
    console.log("Uploaded Video URL:", res.url);

    try {
      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: videoTitle,
          description: videoDescription,
          videoUrl: res.url,
          thumbnailUrl: `${res.url}?thumbnail=true`,
          controls: true,
        }),
      });

      const responseData = await saveRes.json();
      console.log("Save response:", responseData);

      if (!saveRes.ok) {
        throw new Error(responseData.error || "Failed to save video metadata");
      }

      showNotification("Video saved to DB", "success");
    } catch (err) {
      console.error("Error saving video to DB:", err);
      showNotification("Upload succeeded, but DB save failed", "warning");
    }
  };

  return (
    <Card className="p-0 max-w-md w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <CardHeader className="border-b border-border p-4">
          <CardTitle></CardTitle>
          <CardDescription>
            Upload your video file and optionally add a title & description.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Title Field */}
          <div>
            <Label htmlFor="title" className="text-sm text-gray-400">
              Title (optional)
            </Label>
            <Input
              id="title"
              placeholder="Enter video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Description Field */}
          <div>
            <Label htmlFor="description" className="text-sm text-gray-400">
              Description (optional)
            </Label>
            <Input
              id="description"
              placeholder="Enter video description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* File Upload */}
          <FileUpload
            fileType="video"
            onSuccess={handleUploadSuccess}
            onProgress={setProgress}
          />

          {/* Progress */}
          {progress > 0 && progress < 100 && (
            <p className="text-sm text-blue-400 animate-pulse">
              ⏳ Uploading... {progress}%
            </p>
          )}

          {progress === 100 && (
            <p className="text-sm text-green-400 font-medium">
              ✅ Upload complete!
            </p>
          )}
        </CardContent>
      </MagicCard>
    </Card>
  );
}
