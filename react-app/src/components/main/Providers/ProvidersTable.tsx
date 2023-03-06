import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import { ProvidersT, Data } from "../../../types/Providers";
import { SortState } from "../../../types/Global";
import EmptyResults from "../../common/EmptyState/EmptyResults";
import Spinner from "../../common/Spinner/Spinner";
import MainTable from "../../common/Table/MainTable";
import { mask } from "remask";
import HeadlessDialog from "../../common/Dialog/HeadlessDialog";
import ProvidersForm from "./ProvidersForm";
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
      dialogContent={<ProvidersForm edit={row} setIsOpen={setIsOpen} />}
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
          formType="providers"
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
  columnHelper.accessor((row) => row?.cnpjCpf, {
    id: "cnpjCpf",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={mask(props.cell.getValue(), [
          "999.999.999-99",
          "99.999.999/9999-99",
        ])}
      />
    ),
    header: () => <span className="text-white">CNPJ/CPF</span>,
  }),
  columnHelper.accessor((row) => row?.nome, {
    id: "nome",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={props.cell.getValue()}
      />
    ),
    header: () => <span className="text-white">Nome</span>,
  }),
  columnHelper.accessor((row) => row?.email, {
    id: "email",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={props.cell.getValue()}
      />
    ),
    header: () => <span className="text-white">E-mail</span>,
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
  columnHelper.accessor((row) => row?.companies.length.toString(), {
    id: "providers",
    cell: (props) => (
      <RowEditDialog
        row={props.cell.row.original}
        value={props.cell.getValue()}
      />
    ),
    header: () => <span className="text-white">Empresas</span>,
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
        name={props.cell.row.original.nome}
      />
    ),
  }),
];

interface Props {
  data: ProvidersT | undefined;
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
const ProvidersTable = ({
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

export default ProvidersTable;
