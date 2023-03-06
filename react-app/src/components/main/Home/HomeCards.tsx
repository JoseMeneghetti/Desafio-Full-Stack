import { Plus } from "phosphor-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Data as CompaniesData } from "../../../types/Companies";
import { Data as ProvidersData } from "../../../types/Providers";
import HeadlessDialog from "../../common/Dialog/HeadlessDialog";
import Spinner from "../../common/Spinner/Spinner";
import { mask } from "remask";
import ProvidersForm from "../Providers/ProvidersForm";
import CompaniesForm from "../Companies/CompaniesForm";

interface Props {
  data: CompaniesData[] | ProvidersData[] | undefined;
  title: string;
  color: string;
  icon: JSX.Element;
  href: string;
}

const HomeCards = ({ data, title, color, icon, href }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[350px] flex flex-col shadow-theme rounded">
      <div>
        <div
          className={`flex items-center ${color} px-4 py-8 border-t-[1px] rounded-t-md border-black`}
        >
          <p className="text-2xl text-white flex justify-center items-center gap-4">
            {icon}
            {title}
          </p>
        </div>
        {!data ? (
          <div className="w-full h-full flex justify-center items-center bg-gray-600 bg-opacity-20 p-4">
            <Spinner size="h-16 w-16" />
          </div>
        ) : (
          <>
            {data?.map((item: CompaniesData | ProvidersData) => {
              if ("cnpj" in item) {
                return (
                  <div key={item.id} className="border-b-[1px] border-gray-200 p-4">
                    <div>
                      <label className="text-white">CNPJ: </label>
                      <span>{mask(item?.cnpj, ["99.999.999/9999-99"])}</span>
                    </div>
                    <div>
                      <label className="text-white">Nome Fantasia: </label>
                      <span>{item?.nomeFantasia}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={item.id} className="border-b-[1px] border-gray-200 p-4">
                  <div>
                    <label className="text-white">CPF/CNPJ: </label>
                    <span>
                      {mask(item.cnpjCpf, [
                        "999.999.999-99",
                        "99.999.999/9999-99",
                      ])}
                    </span>
                  </div>
                  <div>
                    <label className="text-white">Nome: </label>
                    <span>{item.nome}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div className="p-4 flex items-center gap-4 justify-start">
          <Link
            to={href}
            className={`px-2 py-1 rounded-xl text-base text-white ${color}`}
          >
            Ver Mais
          </Link>
          <HeadlessDialog
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            button={
              <button
                className="border-[1px] border-black bg-teal-600 rounded-full text-base text-white font-bold p-1 disabled:bg-gray-300"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                }}
              >
                <Plus size={22} />
              </button>
            }
            dialogContent={
              data && data[0] && "cnpj" in data[0] ? (
                <CompaniesForm setIsOpen={setIsOpen} />
              ) : (
                <ProvidersForm setIsOpen={setIsOpen} />
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
