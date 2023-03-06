import { Check, Warning } from "phosphor-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  message: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Validation = ({ message, setIsOpen, setIsLoading }: Props) => {
  return (
    <div className="flex gap-8 items-center">
      <div className="text-purple-600">
        <Warning size={100} weight="bold" />
      </div>
      <div className="flex flex-col justify-between gap-8">
        <p>{message}</p>
        <button
          className="flex self-end w-fit items-center border-[1px] border-black bg-teal-600 rounded-full text-base text-white font-bold px-8 py-1 disabled:bg-gray-300"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
            setIsLoading(false);
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Validation;
