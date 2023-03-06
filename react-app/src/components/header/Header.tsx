import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="m-auto flex flex-col md:flex-row justify-center md:justify-between items-center xl:max-w-[1200px] 2xl:max-w-[1640px] w-[95vw] h-16 mt-4 bg-dark-theme font-bold text-2xl shadow-theme rounded-lg">
      <Link className="ml-0 md:ml-12 flex" to="/">
        <span className="text-white">Desafio Full-Stack</span>
      </Link>
      <div className="flex flex-row mr-0 md:mr-12 items-center">
        <Link
          to={"/companies"}
          className="px-4 text-xl text-white font-bold  border-r-gray-200 border-r-[1px] tracking-normal"
        >
          Empresas
        </Link>
        <Link
          to={"/providers"}
          className="px-4 text-xl font-bold text-white border-r-gray-200 tracking-normal"
        >
          Fornecedores
        </Link>
      </div>
    </div>
  );
};

export default Header;
