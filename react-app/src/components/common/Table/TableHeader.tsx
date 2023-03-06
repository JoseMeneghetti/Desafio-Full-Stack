import { Dispatch, SetStateAction } from "react";
import CompaniesForm from "../../main/Companies/CompaniesForm";
import ProvidersForm from "../../main/Providers/ProvidersForm";
import HeadlessDialog from "../Dialog/HeadlessDialog";
import SearchInput from "../Search/SearchInput";

interface Props {
  title: string;
  setSearchParam: Dispatch<SetStateAction<string>>;
  formType: "companies" | "providers";
  isOpenCreate: boolean;
  setIsOpenCreate: Dispatch<SetStateAction<boolean>>;
}

const TableHeader = ({
  title,
  setSearchParam,
  formType,
  isOpenCreate,
  setIsOpenCreate,
}: Props) => {
  return (
    <div className="flex flex-row justify-between px-4 md:px-12 pb-12 pt-2">
      <div className="flex flex-col w-full gap-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex flex-row gap-4 items-center justify-center">
          <SearchInput
            id="searchParamCompany"
            name="searchParamCompany"
            placeholder={"Buscar"}
            setSearchParam={setSearchParam}
          />
          <HeadlessDialog
            setIsOpen={setIsOpenCreate}
            isOpen={isOpenCreate}
            dialogContent={
              formType === "companies" ? (
                <CompaniesForm setIsOpen={setIsOpenCreate} />
              ) : (
                <ProvidersForm setIsOpen={setIsOpenCreate} />
              )
            }
            button={
              <button
                className="border-[1px] border-black bg-teal-600 rounded-full text-base text-white font-bold px-8 py-1 disabled:bg-gray-300"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenCreate(true);
                }}
              >
                Novo
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
