import { NextResponse } from "next/server";
import { CurrentProfile } from "@/lib/currentProfile";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const profile = CurrentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    const BATCH = 10;

    if (!profile) return new NextResponse("unauthorised", { status: 401 });
    if (!channelId) return new NextResponse("no channel", { status: 400 });

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { channelId },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      messages = await db.message.findMany({
        take: BATCH,
        where: { channelId },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (messages.length === BATCH) {
      nextCursor = messages[BATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[MESSAGE_FETCH_ERROR", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
