import axios from "axios";

async function CreateFunctions(
  tableName: "companies" | "providers",
  bodyContent: string
) {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const reqOptions = {
    url: `${import.meta.env.VITE_APP_DOMAIN}/${tableName}`,
    method: "POST",
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

export default CreateFunctions;
