import { createContext, useState } from "react";

type TableContextProps = {
  refresh: boolean;
  setRefresh: (language: boolean) => void;
  refreshTable: () => void;
};

export const TableContext = createContext<TableContextProps | null>(null);

export const TableProvider: React.FC<any> = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  function refreshTable() {
    setRefresh(!refresh);
  }

  return (
    <TableContext.Provider
      value={{
        refresh,
        setRefresh,
        refreshTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
