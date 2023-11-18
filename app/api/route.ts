import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Log } from "@/types";

export async function GET(req: Request) {
  try {
    const logs = await db.log.findMany({});

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error) {
    console.error("[GET_ALL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const logReq: Log = await req.json();
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      metadata: { parentResourceId },
    } = logReq;

    const log = await db.log.create({
      data: {
        level,
        message,
        resourceId,
        timestamp,
        traceId,
        spanId,
        commit,
        metadata: {
          create: { parentResourceId },
        },
      },
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("[POST_LOG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
