import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import User from "@/models/Users";
import Video, { IVideo } from "@/models/Videos";
import next from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDb();
    const Videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!Videos || Videos.length === 0) {
      return NextResponse.json([], { status: 200 }); 
    }

    return NextResponse.json(Videos, { status: 200 }); 
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    //check if user is logged in

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 401 }
      );
    }

    //-------------------------------------------------------------------------------------------

    //for connect to db
    await connectToDb();

    //get video data

    const body: IVideo = await req.json();

    if (
      !body.description ||
      !body.title ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Video data is required" },
        { status: 400 }
      );
    }

    //create video

    const VideoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        width: 1080,
        height: 1920,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(VideoData);

    return NextResponse.json({ newVideo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "fail to create video" },
      { status: 500 }
    );
  }
}
