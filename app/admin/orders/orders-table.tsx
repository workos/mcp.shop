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
  TrashIcon,
} from "@heroicons/react/24/outline";
import { updateSentStatus, softDeleteOrder } from "./actions";

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingOrders, setUpdatingOrders] = useState<Set<number>>(new Set());

  const handleSentToggle = async (order: Order) => {
    const newSentStatus = !order.sent;
    setUpdatingOrders((prev) => new Set(prev).add(order.id));

    // Optimistically update the UI
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, sent: newSentStatus } : o))
    );

    try {
      const result = await updateSentStatus(order.userId, order.id, newSentStatus);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to update order");
      }
    } catch (error) {
      // Revert on error
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, sent: !newSentStatus } : o))
      );
      console.error("Error updating sent status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }
  };

  const handleDelete = async (order: Order) => {
    if (!confirm(`Are you sure you want to delete order #${order.id}?`)) {
      return;
    }

    setUpdatingOrders((prev) => new Set(prev).add(order.id));

    // Optimistically remove from UI
    setOrders((prev) => prev.filter((o) => o.id !== order.id));

    try {
      const result = await softDeleteOrder(order.userId, order.id);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to delete order");
      }
    } catch (error) {
      // Revert on error
      setOrders((prev) => [...prev, order].sort((a, b) => a.id - b.id));
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }
  };

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
    {
      accessorKey: "sent",
      header: "Sent",
      cell: (info) => {
        const order = info.row.original;
        const isUpdating = updatingOrders.has(order.id);
        return (
          <button
            onClick={() => handleSentToggle(order)}
            disabled={isUpdating}
            className="group relative flex items-center justify-center"
          >
            <input
              type="checkbox"
              checked={order.sent || false}
              onChange={() => {}}
              disabled={isUpdating}
              className="h-5 w-5 cursor-pointer rounded border-neutral-700 bg-neutral-900 text-purple-600 transition focus:ring-2 focus:ring-purple-600 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {isUpdating && (
              <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
            )}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const order = info.row.original;
        const isUpdating = updatingOrders.has(order.id);
        return (
          <button
            onClick={() => handleDelete(order)}
            disabled={isUpdating}
            className="group relative flex items-center justify-center rounded p-2 text-neutral-400 transition hover:bg-red-900/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete order"
          >
            <TrashIcon className="h-5 w-5" />
            {isUpdating && (
              <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
            )}
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
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
            Manage and view all orders ({orders.length} total)
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
                <>
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
                  <tr key={`${headerGroup.id}-filter`}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-2">
                        {header.column.getCanFilter() ? (
                          <input
                            type="text"
                            value={(header.column.getFilterValue() ?? "") as string}
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
                            }
                            placeholder={`Filter...`}
                            className="w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-white placeholder-neutral-500 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600/20"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : null}
                      </th>
                    ))}
                  </tr>
                </>
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
            Showing {table.getFilteredRowModel().rows.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="mt-8 rounded-lg border border-neutral-800 bg-black p-12 text-center">
          <p className="text-neutral-400">No orders found</p>
        </div>
      )}
    </div>
  );
}

