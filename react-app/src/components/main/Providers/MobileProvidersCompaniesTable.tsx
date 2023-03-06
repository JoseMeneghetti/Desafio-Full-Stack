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
  value2: string;
}

const columnHelper = createColumnHelper<ProviderCompaniesColumns>();

const RowEditDialog = ({ row, value, value2 }: RowEditDialogProps) => {
  return (
    <div className="flex flex-col">
      <span className="cursor-pointer text-sm">{value}</span>
      <span className="cursor-pointer text-sm">{value2}</span>
    </div>
  );
};

interface Props {
  data: ProviderCompaniesColumns[] | undefined;
  defaultData: never[];
  setSelectedCompanies: Dispatch<
    SetStateAction<ProviderCompaniesColumns[] | undefined>
  >;
}
const MobileProvidersCompaniesTable = ({
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
    <div className="relative py-2 w-full flex justify-between flex-col mt-4">
      <MainTable table={table} />
    </div>
  );
};

export default MobileProvidersCompaniesTable;
