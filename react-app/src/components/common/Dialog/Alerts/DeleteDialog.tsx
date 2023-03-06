import { Check, Warning } from "phosphor-react";
import { Dispatch, SetStateAction } from "react";
import useTableHook from "../../../hooks/UseTableContext";
import DeleteFunctions from "../../../lib/DeleteFunctions";

interface Props {
  message: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  formType: "companies" | "providers";
  id: number;
}

const DeleteDialog = ({ message, setIsOpen, formType, id }: Props) => {
  const useTable = useTableHook();

  return (
    <div className="flex gap-8 items-center">
      <div className="text-purple-600">
        <Warning size={100} weight="bold" />
      </div>
      <div className="flex flex-col justify-between gap-8">
        <p>{message}</p>
        <div className="flex gap-4 justify-end">
          <button
            className="flex self-end w-fit items-center border-[1px] border-black bg-teal-600 rounded-full text-base text-white font-bold px-8 py-1 disabled:bg-gray-300"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            Fechar
          </button>
          <button
            className="flex self-end w-fit items-center border-[1px] border-black bg-rose-600 rounded-full text-base text-white font-bold px-8 py-1 disabled:bg-gray-300"
            onClick={(e) => {
              e.preventDefault();
              DeleteFunctions(formType, id);
              setTimeout(() => useTable?.refreshTable(), 1000);
              setIsOpen(false);
            }}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
