"use client";

import {
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_Virtualizer,
} from "material-react-table";
import { Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Log } from "@/types";

type LogApiResponse = {
  data: Array<Log>;
  meta: {
    totalRowCount: number;
  };
};

const columns: MRT_ColumnDef<Log>[] = [
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "resourceId",
    header: "ResourceID",
  },
  {
    accessorKey: "timestamp",
    header: "TimeStamp",
  },
  {
    accessorKey: "traceId",
    header: "TraceID",
  },
  {
    accessorKey: "spanId",
    header: "SpanID",
  },
  {
    accessorKey: "commit",
    header: "Commit",
  },
];

const fetchSize = 10;

export function DataTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery<LogApiResponse>({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam }) => {
        const url = new URL(
          "/api",
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"
        );
        url.searchParams.set("start", `${(pageParam as number) * fetchSize}`);
        url.searchParams.set("size", `${fetchSize}`);
        url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
        url.searchParams.set("globalFilter", globalFilter ?? "");
        url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

        const response = await fetch(url.href);
        const json = (await response.json()) as LogApiResponse;
        return json;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useMaterialReactTable({
    columns,
    initialState: {
      showColumnFilters: true,
      isFullScreen: true,
      showGlobalFilter: true,
    },
    data: flatData,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    manualFiltering: true,
    manualSorting: true,
    muiTableContainerProps: {
      ref: tableContainerRef,
      onScroll: (event: UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement),
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    renderBottomToolbarCustomActions: () => (
      <Typography>
        Fetched {totalFetched} of {totalDBRowCount} total rows.
      </Typography>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
  });

  return <MaterialReactTable table={table} />;
}
