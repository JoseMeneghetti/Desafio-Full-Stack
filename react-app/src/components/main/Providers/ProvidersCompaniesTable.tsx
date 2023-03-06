import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import MainTable from "../../common/Table/MainTable";
import { mask } from "remask";
import { ProviderCompaniesColumns } from "../../../types/Global";
import { Dispatch, SetStateAction } from "react";
import { Trash } from "phosphor-react";

interface RowEditDialogProps {
  row: ProviderCompaniesColumns[] | any;
  value: string;
}

const columnHelper = createColumnHelper<ProviderCompaniesColumns>();

const RowEditDialog = ({ row, value }: RowEditDialogProps) => {
  return <span>{value}</span>;
};

interface Props {
  data: ProviderCompaniesColumns[] | undefined;
  defaultData: never[];
  setSelectedCompanies: Dispatch<
    SetStateAction<ProviderCompaniesColumns[] | undefined>
  >;
}
const ProvidersCompaniesTable = ({
  data,
  defaultData,
  setSelectedCompanies,
}: Props) => {
  const RowDelete = ({ id }: { id: number }) => {
    return (
      <button
        className="flex self-end w-fit items-center border-[1px] border-black bg-rose-600 rounded-full text-base text-white font-bold px-4 py-1 disabled:bg-gray-300"
        onClick={(e) => {
          e.preventDefault();
          setSelectedCompanies((old) => {
            return old && old.filter((el) => el.id !== id);
          });
        }}
      >
        <Trash size={18} weight="bold" />
      </button>
    );
  };

  const columns = [
    columnHelper.accessor((row) => row?.cnpj, {
      id: "cnpjCpf",
      cell: (props) => (
        <RowEditDialog
          row={props.cell.row.original}
          value={mask(props.cell.getValue(), ["99.999.999/9999-99"])}
        />
      ),
      header: () => <span className="text-white">CNPJ/CPF</span>,
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

export default ProvidersCompaniesTable;
