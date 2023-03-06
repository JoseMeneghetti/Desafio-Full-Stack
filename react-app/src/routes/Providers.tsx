import { PaginationState } from "@tanstack/table-core";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "../components/common/Table/TableHeader";
import { ProvidersT } from "../types/Providers";
import { SortState } from "../types/Global";
import ProvidersTable from "../components/main/Providers/ProvidersTable";
import MobileProvidersTable from "../components/main/Providers/MobileProvidersTable";
import useDeviceType from "../components/hooks/UseDeviceType";
import useTableHook from "../components/hooks/UseTableContext";

const Providers = () => {
  const device = useDeviceType();
  const useTable = useTableHook();
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ProvidersT>();

  const [searchParam, setSearchParam] = useState("");
  const [{ sortName, sortValue }, setSort] = useState<SortState>({
    sortName: "",
    sortValue: "",
  });

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const sort = useMemo(
    () => ({
      sortName,
      sortValue,
    }),
    [sortName, sortValue]
  );

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_APP_DOMAIN}/providers`, {
        params: {
          page: pageIndex,
          size: pageSize,
          sort: `${sortName},${sortValue}`,
          search: searchParam,
        },
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [
    pageIndex,
    pageSize,
    sortName,
    sortValue,
    searchParam,
    useTable?.refresh,
  ]);

  return (
    <div className="m-auto flex flex-col py-12 xl:max-w-[1200px] 2xl:max-w-[1640px] w-[95vw] my-8 bg-dark-theme shadow-theme rounded-lg border-t-8 border-purple-500 gap-7">
      <div className="w-full pt-4">
        <TableHeader
          title={"Gerenciamento de Fornecedores"}
          setSearchParam={setSearchParam}
          setIsOpenCreate={setIsOpenCreate}
          isOpenCreate={isOpenCreate}
          formType="providers"
        />
        {device === "Phone" ? (
          <MobileProvidersTable
            data={data}
            defaultData={defaultData}
            isLoading={isLoading}
            pagination={pagination}
            setPagination={setPagination}
            setSort={setSort}
            sort={sort}
          />
        ) : (
          <ProvidersTable
            data={data}
            defaultData={defaultData}
            isLoading={isLoading}
            pagination={pagination}
            setPagination={setPagination}
            setSort={setSort}
            sort={sort}
          />
        )}
      </div>
    </div>
  );
};

export default Providers;
