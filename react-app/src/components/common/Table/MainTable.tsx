import { flexRender, Table } from "@tanstack/react-table";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
  SortAscending,
  SortDescending,
  TextAlignJustify,
} from "phosphor-react";
import { Dispatch, SetStateAction } from "react";
import { SortState } from "../../../types/Global";

interface Props {
  table: Table<any>; //TODO type it
  sort?: {
    sortName: string;
    sortValue: string;
  };
  setSort?: Dispatch<SetStateAction<SortState>>;
  sizesPage?: number[];
}

const MainTable = ({ table, sort, setSort, sizesPage }: Props) => {
  return (
    <>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={`text-left font-bold text-base`}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <div
                        className={`flex flex-row items-center gap-4 mb-4 ${
                          header.id === "actions" ? "justify-end" : ""
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {sort && setSort && (
                          <>
                            {sort?.sortName === header.column.id &&
                              sort?.sortValue === "desc" && (
                                <SortDescending
                                  size={24}
                                  color="#fff"
                                  weight="bold"
                                  onClick={() =>
                                    setSort({
                                      sortName: "",
                                      sortValue: "",
                                    })
                                  }
                                />
                              )}

                            {sort?.sortName === header.column.id &&
                              sort?.sortValue === "asc" && (
                                <SortAscending
                                  size={24}
                                  color="#fff"
                                  weight="bold"
                                  onClick={() =>
                                    setSort({
                                      sortName: header.column.id,
                                      sortValue: "desc",
                                    })
                                  }
                                />
                              )}

                            {header.column.id !== "actions" &&
                              header.column.id !== "providers" &&
                              sort?.sortName !== header.column.id && (
                                <TextAlignJustify
                                  size={24}
                                  color="#fff"
                                  weight="bold"
                                  onClick={() =>
                                    setSort({
                                      sortName: header.column.id,
                                      sortValue: "asc",
                                    })
                                  }
                                />
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="text-left border-t-[1px] border-divisor py-4 text-base "
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sort && setSort && sizesPage && (
        <>
          <div className="flex flex-col md:flex-row items-center gap-2 justify-center pt-8">
            <div className="flex gap-2">
              <button
                className="border rounded px-4 py-2 disabled:text-gray-600 text-white"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <CaretDoubleLeft size={16} weight="bold" />
              </button>
              <button
                className="border rounded px-4 py-2 disabled:text-gray-600 text-white"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                className="border rounded px-4 py-2 disabled:text-gray-600 text-white"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <CaretRight size={16} weight="bold" />
              </button>
              <button
                className="border rounded px-4 py-2 disabled:text-gray-600 text-white"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <CaretDoubleRight size={16} weight="bold" />
              </button>
            </div>

            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <div>Pagina</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Ir para:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16 bg-input-theme text-white"
                />
              </span>
              <select
                className="bg-input-theme text-white"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {sizesPage.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Mostrar {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainTable;
