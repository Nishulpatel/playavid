import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const { token, signature, expire } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    });

    return Response.json({ token, signature, expire });
  } catch (error) {
    return Response.json({ error: "Auth failed imagekit" }, { status: 500 });
  }
}
