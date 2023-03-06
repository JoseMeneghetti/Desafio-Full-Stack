import React from "react";
import ReactDOM from "react-dom/client";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error-page";
import Home from "./routes/Home";
import Companies from "./routes/Companies";
import Providers from "./routes/Providers";
import { TableProvider } from "./components/context/TableContext";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <>
        <title>Desafio Full-Stack - Home</title>
        <Header />
        <Home />
        <Footer />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/companies",
    element: (
      <TableProvider>
        <title>Desafio Full-Stack - Empresas</title>
        <Header />
        <Companies />
        <Footer />
      </TableProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/providers",
    element: (
      <TableProvider>
        <title>Desafio Full-Stack - Fornecedores</title>
        <Header />
        <Providers />
        <Footer />
      </TableProvider>
    ),
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
