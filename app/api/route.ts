import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Log } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const size = searchParams.get("size");
  const filters = searchParams.get("filters");
  const globalFilter = searchParams.get("globalFilter");
  const sorting = searchParams.get("sorting");

  let dbData: Log[];

  function getValue(
    id: "level" | "message" | "commit" | "resourceId" | "traceId" | "spanId"
  ) {
    if (filters?.length! <= 2) return "";
    const filter = JSON.parse(filters!);
    for (const item of filter) {
      if (item.id === id) {
        return item.value;
      }
    }
    return "";
  }

  const getOrder = () => {
    if (sorting?.length! <= 2) return { id: "", desc: "" };
    const sort = JSON.parse(sorting!);
    return {
      id: sort[0].id,
      desc: sort[0].desc,
    };
  };
  const order = getOrder();

  try {
    const logs = await db.log.findMany({
      where: {
        AND: {
          level: {
            contains: getValue("level"),
            mode: "insensitive",
          },
          message: {
            contains: getValue("message"),
            mode: "insensitive",
          },
          commit: {
            contains: getValue("commit"),
            mode: "insensitive",
          },
          resourceId: {
            contains: getValue("resourceId"),
            mode: "insensitive",
          },
          traceId: {
            contains: getValue("traceId"),
            mode: "insensitive",
          },
          spanId: {
            contains: getValue("spanId"),
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        level: order.id === "level" ? (order.desc ? "desc" : "asc") : undefined,
        message:
          order.id === "message" ? (order.desc ? "desc" : "asc") : undefined,
        commit:
          order.id === "commit" ? (order.desc ? "desc" : "asc") : undefined,
        resourceId:
          order.id === "resourceId" ? (order.desc ? "desc" : "asc") : undefined,
        traceId:
          order.id === "traceId" ? (order.desc ? "desc" : "asc") : undefined,
        spanId:
          order.id === "spanId" ? (order.desc ? "desc" : "asc") : undefined,
      },
      include: {
        metadata: true,
      },
    });

    dbData = logs;

    if (globalFilter) {
      dbData = dbData.filter((row) =>
        Object.keys(row).some((columnId) =>
          row[columnId as keyof Log]
            ?.toString()
            ?.toLowerCase()
            ?.includes?.((globalFilter as string).toLowerCase())
        )
      );
    }

    return NextResponse.json(
      {
        data:
          dbData?.slice(parseInt(start!), parseInt(start!) + parseInt(size!)) ??
          [],
        meta: { totalRowCount: dbData.length },
      },
      { status: 200 }
    );
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
