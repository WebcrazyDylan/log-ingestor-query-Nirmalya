"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_Virtualizer,
  MRT_PaginationState,
} from "material-react-table";
import { useQuery } from "@tanstack/react-query";

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

export function DataTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);

  const { data, isError, isFetching, isLoading } = useQuery<LogApiResponse>({
    queryKey: ["table-data", columnFilters, globalFilter, sorting, pagination],
    queryFn: async () => {
      const url = new URL(
        "/api",
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      );
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      const response = await fetch(url.href);
      const json = (await response.json()) as LogApiResponse;
      setRowCount(json.meta.totalRowCount);

      return json;
    },
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  const table = useMaterialReactTable({
    columns,
    initialState: {
      showColumnFilters: true,
      isFullScreen: true,
      showGlobalFilter: true,
    },
    data: flatData,
    enablePagination: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    muiTableContainerProps: {
      ref: tableContainerRef,
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    rowCount,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
      pagination,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
  });

  return <MaterialReactTable table={table} />;
}
