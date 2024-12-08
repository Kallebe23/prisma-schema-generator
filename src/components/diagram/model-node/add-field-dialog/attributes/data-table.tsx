"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelFieldAttribute } from "@/types/schema";

type RowSelection = Record<string, boolean>;

export interface DataTableProps {
  columns: ColumnDef<ModelFieldAttribute, unknown>[];
  data: ModelFieldAttribute[];
  defaultRowSelection?: RowSelection;
  onSelectedAttributesChange: (newRowSelection: RowSelection) => void;
}

export function AttributesTable({
  columns,
  data,
  defaultRowSelection,
  onSelectedAttributesChange,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState<RowSelection>(
    defaultRowSelection || {}
  );
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (onSelectedAttributesChange) {
      onSelectedAttributesChange(rowSelection);
    }
  }, [rowSelection, onSelectedAttributesChange]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.name,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection: rowSelection,
    },
  });

  return (
    <div className="w-full">
      <ScrollArea className="h-[280px] rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead />
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.preventDefault();
                          setExpandedRows((prev) => ({
                            ...prev,
                            [row.id]: !prev[row.id],
                          }));
                        }}
                      >
                        {expandedRows[row.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows[row.id] && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1}>
                        <div className="p-4">
                          <h3 className="font-semibold">Argumentos</h3>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem atributos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} atributo(s) selecionados.
        </div>
      </div>
    </div>
  );
}
