import axios from "axios";
import { Buildings, FolderUser } from "phosphor-react";
import { useEffect, useState } from "react";
import Spinner from "../components/common/Spinner/Spinner";
import HomeCards from "../components/main/Home/HomeCards";
import { Data as CompaniesData } from "../types/Companies";
import { Data as ProvidersData } from "../types/Providers";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<CompaniesData[]>();
  const [providers, setProviders] = useState<ProvidersData[]>();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_APP_DOMAIN}/companies`, {
        params: {
          size: 3,
        },
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setCompanies(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${import.meta.env.VITE_APP_DOMAIN}/providers`, {
        params: {
          size: 3,
        },
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setProviders(response.data.data);
      })
      .catch((error) => console.log(error));

    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="absolute w-full h-full flex justify-center items-center bg-gray-600 bg-opacity-20 top-0 left-0">
          <Spinner size="h-20 w-20" />
        </div>
      )}

      <div className="m-auto flex flex-col p-12 xl:max-w-[1200px] 2xl:max-w-[1640px] w-[95vw] my-8 bg-dark-theme shadow-theme rounded-lg border-t-8 border-black gap-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem vindo!</h1>
          <p className="text-white">
            Desafio Full-Stack - Jose Ricardo M Pinto
          </p>
        </div>
        <div className="flex flex-row justify-center lg:justify-start items-start  flex-wrap gap-8">
          <HomeCards
            data={companies}
            color={"bg-violet-900"}
            title="Empresas"
            icon={<Buildings size={32} color="#fff" weight="bold" />}
            href={"/companies"}
          />

          <HomeCards
            data={providers}
            color={"bg-purple-600"}
            title="Fornecedores"
            icon={<FolderUser size={32} color="#fff" weight="bold" />}
            href={"/providers"}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
