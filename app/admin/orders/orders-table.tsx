"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Order } from "@/lib/orders";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order #",
      cell: (info) => (
        <span className="font-mono font-semibold text-purple-400">
          #{info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: (info) => {
        const dateValue = info.getValue();
        if (!dateValue) return <span className="text-sm text-neutral-500">N/A</span>;
        
        const date = new Date(dateValue as string);
        if (isNaN(date.getTime())) {
          return <span className="text-sm text-neutral-500">Invalid Date</span>;
        }
        
        return (
          <span className="text-sm">
            {Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(date)}
          </span>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "tshirtSize",
      header: "Size",
      cell: (info) => (
        <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs font-medium">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "isRunMcpShirt",
      header: "Shirt Type",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            info.getValue()
              ? "bg-green-900/30 text-green-400"
              : "bg-blue-900/30 text-blue-400"
          }`}
        >
          {info.getValue() ? "RUN MCP" : "MCP"}
        </span>
      ),
    },
    {
      accessorKey: "mailingAddress",
      header: "Mailing Address",
      cell: (info) => (
        <span className="max-w-xs truncate text-sm">
          {info.getValue() as string}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: initialOrders,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mx-auto max-w-[--breakpoint-2xl] px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-medium text-white">Admin Orders</h1>
          <p className="mt-2 text-neutral-400">
            Manage and view all orders ({initialOrders.length} total)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full rounded-lg border border-neutral-800 bg-black py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-black">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-800 bg-neutral-900/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-white"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex cursor-pointer select-none items-center gap-2 hover:text-purple-400"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-neutral-500">
                              {{
                                asc: <ArrowUpIcon className="h-4 w-4" />,
                                desc: <ArrowDownIcon className="h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <div className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-800 transition hover:bg-neutral-900/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-neutral-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results Summary */}
        <div className="border-t border-neutral-800 px-6 py-4">
          <div className="text-sm text-neutral-400">
            Showing {table.getFilteredRowModel().rows.length} of {initialOrders.length} orders
          </div>
        </div>
      </div>

      {/* Empty State */}
      {initialOrders.length === 0 && (
        <div className="mt-8 rounded-lg border border-neutral-800 bg-black p-12 text-center">
          <p className="text-neutral-400">No orders found</p>
        </div>
      )}
    </div>
  );
}

