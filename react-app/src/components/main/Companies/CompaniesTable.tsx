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
import { mask, unMask } from "remask";
import HeadlessDialog from "../../common/Dialog/HeadlessDialog";
import CompaniesForm from "./CompaniesForm";
import DeleteDialog from "../../common/Dialog/Alerts/DeleteDialog";
import { Trash } from "phosphor-react";


const columnHelper = createColumnHelper<Data>();

interface RowEditDialogProps {
  row: Data | any;
  value: string;
}

const RowEditDialog = ({ row, value }: RowEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HeadlessDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button={
        <span className="cursor-pointer" onClick={() => setIsOpen(true)}>
          {value}
        </span>
      }
      dialogContent={<CompaniesForm edit={row} setIsOpen={setIsOpen} />}
    />
  );
};

interface RowDeleteProps {
  id: number;
  name: string;
}

const RowDelete = ({ id, name }: RowDeleteProps) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  return (
    <HeadlessDialog
      dialogContent={
        <DeleteDialog
          setIsOpen={setIsOpenDelete}
          message={`Confirma que deseja delete a Empresa ${name} ?`}
          formType="companies"
          id={id}
        />
      }
      setIsOpen={setIsOpenDelete}
      isOpen={isOpenDelete}
      customClass={"!w-fit"}
      button={
        <button
          className="flex self-end w-fit items-center border-[1px] border-black bg-rose-600 rounded-full text-base text-white font-bold px-4 py-1 disabled:bg-gray-300"
          onClick={(e) => {
            setIsOpenDelete(true);
            e.preventDefault();
          }}
        >
          <Trash size={18} weight="bold" />
        </button>
      }
    />
  );
};

const columns = [
  columnHelper.accessor((row) => row?.cnpj, {
    id: "cnpj",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={mask(props.cell.getValue(), ["99.999.999/9999-99"])}
      />
    ),
    header: () => <span className="text-white">CNPJ</span>,
  }),
  columnHelper.accessor((row) => row?.nomeFantasia, {
    id: "nomeFantasia",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={props.cell.getValue()}
      />
    ),
    header: () => <span className="text-white">Nome Fantasia</span>,
  }),
  columnHelper.accessor((row) => row?.cep, {
    id: "cep",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={mask(props.cell.getValue(), ["99999-999"])}
      />
    ),
    header: () => <span className="text-white">Cep</span>,
  }),
  columnHelper.accessor((row) => row?.providers.length.toString(), {
    id: "providers",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={props.cell.getValue()}
      />
    ),
    header: () => <span className="text-white">Fornecedores</span>,
  }),
  columnHelper.accessor(
    (row) => new Date(row?.createdAt).toLocaleDateString("pt-BR"),
    {
      id: "createdAt",
      cell: (props) => (
        <RowEditDialog
          row={props.cell.row.original}
          value={props.cell.getValue()}
        />
      ),
      header: () => <span className="text-white">Data de Criacao</span>,
    }
  ),
  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <RowDelete
        id={props.cell.row.original.id}
        name={props.cell.row.original.nomeFantasia}
      />
    ),
  }),
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
const CompaniesTable = ({
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
    <div className="relative py-2 px-12 w-full flex justify-between flex-col">
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

export default CompaniesTable;
