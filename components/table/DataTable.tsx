"use client";

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { encryptKey } from "@/lib/utils";

import {
  appointmentTableFeatures,
  AppointmentTableFeatures,
} from "./data-table-features";

const getAdminAuthorization = () => {
  const adminPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;

  if (typeof window === "undefined" || !adminPasskey) {
    return false;
  }

  return window.localStorage.getItem("accessKey") === encryptKey(adminPasskey);
};

const subscribeToAdminAuthorization = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
};

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<AppointmentTableFeatures, TData>[];
  data: TData[];
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const router = useRouter();
  const isAuthorized = useSyncExternalStore(
    subscribeToAdminAuthorization,
    getAdminAuthorization,
    () => false
  );

  useEffect(() => {
    if (!isAuthorized) {
      router.replace("/");
    }
  }, [isAuthorized, router]);

  const table = useTable({
    features: appointmentTableFeatures,
    data,
    columns,
  });

  if (!isAuthorized) {
    return <div className="data-table" aria-busy="true" />;
  }

  return (
    <div className="data-table">
      <Table className="shad-table">
        <TableHeader className="bg-dark-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="shad-table-row"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="table-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
          aria-label="Page précédente"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt=""
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
          aria-label="Page suivante"
        >
          <Image
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt=""
            className="rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}
