import axios from "axios";

async function EditFunctions(
  tableName: "companies" | "providers",
  bodyContent: string,
  id: number
) {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  console.log("body", bodyContent)
  const reqOptions = {
    url: `${import.meta.env.VITE_APP_DOMAIN}/${tableName}/${id}`,
    method: "PATCH",
    headers: headersList,
    data: bodyContent,
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

export default EditFunctions;
