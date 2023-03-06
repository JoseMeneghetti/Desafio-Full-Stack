import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import { CompaniesT, Data } from "../../../types/Companies";
import { SortState } from "../../../types/Global";
import EmptyResults from "../../common/EmptyState/EmptyResults";
import Spinner from "../../common/Spinner/Spinner";
import MainTable from "../../common/Table/MainTable";
import { mask } from "remask";
import HeadlessDialog from "../../common/Dialog/HeadlessDialog";
import CompaniesForm from "./CompaniesForm";

interface RowEditDialogProps {
  row: Data | any;
  value: string;
  value2?: string;
}

const columnHelper = createColumnHelper<Data>();

const RowEditDialog = ({ row, value, value2 }: RowEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HeadlessDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button={
        <div className="flex flex-col">
          <span className="cursor-pointer" onClick={() => setIsOpen(true)}>
            {value}
          </span>
          <span className="cursor-pointer" onClick={() => setIsOpen(true)}>
            {value2}
          </span>
        </div>
      }
      dialogContent={<CompaniesForm edit={row} setIsOpen={setIsOpen} />}
    />
  );
};

const columns = [
  columnHelper.accessor((row) => row?.cnpj, {
    id: "cnpj",
    cell: (props) => {
      return (
        <RowEditDialog
          row={props.cell.row.original}
          value={mask(props.cell.getValue(), ["99.999.999/9999-99"])}
          value2={props.cell.row.original.nomeFantasia}
        />
      );
    },
    header: () => (
      <div className="flex flex-col">
        <span className="text-white text-sm">CNPJ</span>
        <span className="text-white text-sm">Nome Fantasia</span>
      </div>
    ),
  }),
  columnHelper.accessor(
    (row) => new Date(row?.createdAt).toLocaleDateString("pt-BR"),
    {
      id: "createdAt",
      cell: (props) => (
        <RowEditDialog
          row={props.cell.row.original}
          value={props.cell.getValue()}
          value2={mask(props.cell.row.original?.cep, ["99999-999"])}
        />
      ),
      header: () => (
        <div className="flex flex-col">
          <span className="text-white text-sm">CEP</span>
          <span className="text-white text-sm">Data de Criacao</span>
        </div>
      ),
    }
  ),
];

interface Props {
  data: CompaniesT | undefined;
  isLoading: boolean;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  defaultData: never[];
  setSort: Dispatch<SetStateAction<SortState>>;
  sort: {
    sortName: string;
    sortValue: string;
  };
}
const MobileCompaniesTable = ({
  data,
  isLoading,
  setPagination,
  pagination,
  defaultData,
  setSort,
  sort,
}: Props) => {
  const table = useReactTable({
    data: data?.data ?? defaultData,
    columns,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  if (!data && isLoading) {
    return (
      <div className="fixed inset-0 z-20 w-full h-full flex justify-center items-center bg-gray-600 bg-opacity-20 top-0 left-0">
        <Spinner size="h-20 w-20" />
      </div>
    );
  }

  if (!data?.data?.length && !isLoading) {
    return <EmptyResults />;
  }

  return (
    <div className="relative py-2 px-4 w-full flex justify-between flex-col">
      <MainTable
        table={table}
        setSort={setSort}
        sort={sort}
        sizesPage={[5, 10, 20, 30, 40, 50]}
      />
      {isLoading ? (
        <div className="fixed inset-0 z-20 w-full h-full flex justify-center items-center bg-gray-600 bg-opacity-10 top-0 left-0">
          <Spinner size="h-20 w-20" />
        </div>
      ) : null}
    </div>
  );
};

export default MobileCompaniesTable;
