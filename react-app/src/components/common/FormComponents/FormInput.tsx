import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  id: string;
  placeholder?: string;
  label: string;
  customClass?: string;
  fullWidth?: boolean;
}
const FormInput = ({
  name,
  id,
  placeholder,
  label,
  customClass,
  fullWidth,
  ...props
}: Props) => {
  return (
    <div
      className={`flex flex-col justify-start ${
        fullWidth ? "w-full" : "w-auto"
      }`}
    >
      <label className="flex flex-row items-start text-base font-bold pb-2 gap-1">
        {label}
      </label>
      <input
        {...props}
        name={name}
        id={id}
        placeholder={placeholder ?? ""}
        className={`w-full py-1 px-1 pl-4 border-[1px] bg-input-theme rounded-lg disabled:bg-stone-900 disabled:border-stone-600 ${
          customClass ?? ""
        }`}
      />
    </div>
  );
};

export default FormInput;
