import axios from "axios";

async function DeleteFunctions(
  tableName: "companies" | "providers",
  id: number
) {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const reqOptions = {
    url: `${import.meta.env.VITE_APP_DOMAIN}/${tableName}/${id}`,
    method: "DELETE",
    headers: headersList,
  };

  const responseData = axios
    .request(reqOptions)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  return responseData;
}

export default DeleteFunctions;
