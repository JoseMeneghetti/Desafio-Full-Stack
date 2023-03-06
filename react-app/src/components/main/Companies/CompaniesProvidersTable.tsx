import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import MainTable from "../../common/Table/MainTable";
import { mask } from "remask";

import { CompanyProvidersColumns } from "../../../types/Global";
import { Trash } from "phosphor-react";
import { Dispatch, SetStateAction } from "react";
interface RowEditDialogProps {
  row: CompanyProvidersColumns[] | any;
  value: string;
}

const columnHelper = createColumnHelper<CompanyProvidersColumns>();

const RowEditDialog = ({ row, value }: RowEditDialogProps) => {
  return <span>{value}</span>;
};

interface Props {
  data: CompanyProvidersColumns[] | undefined;
  defaultData: never[];
  setSelectedProviders: Dispatch<
    SetStateAction<CompanyProvidersColumns[] | undefined>
  >;
}

const CompaniesProvidersTable = ({
  data,
  defaultData,
  setSelectedProviders,
}: Props) => {
  const RowDelete = ({ id }: { id: number }) => {
    return (
      <button
        className="flex self-end w-fit items-center border-[1px] border-black bg-rose-600 rounded-full text-base text-white font-bold px-4 py-1 disabled:bg-gray-300"
        onClick={(e) => {
          e.preventDefault();
          setSelectedProviders((old) => {
            return old && old.filter((el) => el.id !== id);
          });
        }}
      >
        <Trash size={18} weight="bold" />
      </button>
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
    columnHelper.display({
      id: "actions",
      cell: (props) => <RowDelete id={props.cell.row.original.id} />,
    }),
  ];

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  if (!data?.length) {
    return (
      <div className="flex flex-col justify-center items-center mt-4">
        <span className="text-lg text-white ">
          Nenhum Fornecedor encontrado
        </span>
        <span>Selecione um novo!</span>
      </div>
    );
  }

  return (
    <div className="relative py-2 px-12 w-full flex justify-between flex-col mt-4">
      <MainTable table={table} />
    </div>
  );
};

export default CompaniesProvidersTable;
