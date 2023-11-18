import { NextResponse } from "next/server";
import {
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
} from "material-react-table";

import { db } from "@/lib/db";
import { Log } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const size = searchParams.get("size");
  const filters = searchParams.get("filters");
  const globalFilter = searchParams.get("globalFilter");
  const sorting = searchParams.get("sorting");
  console.log({ start, size, filters, sorting, globalFilter });

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

  try {
    const logs = await db.log.findMany({
      where: {
        AND: {
          level: {
            contains: getValue("level"),
          },
          message: {
            contains: getValue("message"),
          },
          commit: {
            contains: getValue("commit"),
          },
          resourceId: {
            contains: getValue("resourceId"),
          },
          traceId: {
            contains: getValue("traceId"),
          },
          spanId: {
            contains: getValue("spanId"),
          },
        },
      },
      include: {
        metadata: true,
      },
    });

    dbData = logs;

    const parsedColumnFilters = JSON.parse(
      filters! as unknown as string
    ) as MRT_ColumnFiltersState;
    if (parsedColumnFilters?.length) {
      parsedColumnFilters.map((filter) => {
        const { id: columnId, value: filterValue } = filter;
        dbData = dbData.filter((row) => {
          return row[columnId as keyof Log]
            ?.toString()
            ?.toLowerCase()
            ?.includes?.((filterValue as string).toLowerCase());
        });
      });
    }

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

    const parsedSorting = JSON.parse(sorting!) as MRT_SortingState;
    if (parsedSorting?.length) {
      const sort = parsedSorting[0];
      const { id, desc } = sort;
      dbData.sort((a, b) => {
        if (desc) {
          return a[id as keyof Log] < b[id as keyof Log] ? 1 : -1;
        }
        return a[id as keyof Log] > b[id as keyof Log] ? 1 : -1;
      });
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
