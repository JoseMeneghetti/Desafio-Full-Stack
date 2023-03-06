import { MagnifyingGlass } from "phosphor-react";

interface Props {
  name: string;
  id: string;
  placeholder: string;
  customClass?: string;
  setSearchParam: (searchParam: string) => void;
}

const SearchInput = ({
  name,
  id,
  placeholder,
  customClass,
  setSearchParam,
}: Props) => {
  return (
    <form className="w-full">
      <div className="relative flex flex-row items-center text-gray-200">
        <MagnifyingGlass size={24} className="absolute ml-2" />
        <input
          name={name}
          id={id}
          placeholder={placeholder}
          className={`w-full py-2 px-4 pl-10 border-[1px] border--gray-200 rounded-lg placeholder:text-center bg-input-theme ${
            customClass ?? ""
          }`}
          onChange={(e) => setSearchParam(e.currentTarget.value)}
        />
      </div>
    </form>
  );
};

export default SearchInput;
