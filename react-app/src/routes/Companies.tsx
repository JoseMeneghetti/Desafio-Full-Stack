import { PaginationState } from "@tanstack/table-core";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "../components/common/Table/TableHeader";
import CompaniesTable from "../components/main/Companies/CompaniesTable";
import MobileCompaniesTable from "../components/main/Companies/MobileCompaniesTable";
import useDeviceType from "../components/hooks/UseDeviceType";
import useTableHook from "../components/hooks/UseTableContext";
import { CompaniesT } from "../types/Companies";
import { SortState } from "../types/Global";

const Companies = () => {
  const device = useDeviceType();
  const useTable = useTableHook();
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CompaniesT>();

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
      .get(`${import.meta.env.VITE_APP_DOMAIN}/companies`, {
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
    <div className="m-auto flex flex-col py-12 xl:max-w-[1200px] 2xl:max-w-[1640px] w-[95vw] my-8 bg-dark-theme shadow-theme rounded-lg border-t-8 border-violet-900 gap-7">
      <div className="w-full pt-4">
        <TableHeader
          title={"Gerenciamento de Empresas"}
          setSearchParam={setSearchParam}
          setIsOpenCreate={setIsOpenCreate}
          isOpenCreate={isOpenCreate}
          formType="companies"
        />
        {device === "Phone" ? (
          <MobileCompaniesTable
            data={data}
            defaultData={defaultData}
            isLoading={isLoading}
            pagination={pagination}
            setPagination={setPagination}
            setSort={setSort}
            sort={sort}
          />
        ) : (
          <CompaniesTable
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

export default Companies;
