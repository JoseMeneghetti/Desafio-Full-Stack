import { useContext } from "react";
import { TableContext } from "../context/TableContext";

const useTableHook = () => useContext(TableContext);

export default useTableHook;
