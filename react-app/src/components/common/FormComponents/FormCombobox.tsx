import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ArrowsOutLineVertical, Check, Trash } from "phosphor-react";
import Spinner from "../Spinner/Spinner";
import { mask } from "remask";
import {
  CompanyProvidersColumns,
  ProviderCompaniesColumns,
} from "../../../types/Global";
interface Props {
  label: string;
  data: CompanyProvidersColumns[] | ProviderCompaniesColumns[] | undefined;
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  setSelecteds:
    | Dispatch<SetStateAction<CompanyProvidersColumns[] | undefined>>
    | Dispatch<SetStateAction<ProviderCompaniesColumns[] | undefined>>;
}

const HeadlessCombobox = ({
  label,
  data,
  setSearch,
  search,
  setSelecteds,
}: Props) => {
  return (
    <div className="relative">
      {!data ? (
        <div className="flex justify-center items-center bg-dark-theme bg-opacity-20 p-4">
          <Spinner size="h-16 w-16" />
        </div>
      ) : (
        <Combobox>
          <label>{label}</label>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-input-theme text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 leading-5 bg-input-theme focus:ring-0"
                displayValue={() => ""}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Adicione um novo ${label}`}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 ">
                <ArrowsOutLineVertical size={18} color="#fff" weight="bold" />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-input-theme shadow-theme py-1 ring-1 ring-white ring-opacity-5 focus:outline-none sm">
                {data?.length === 0 && search !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 ">
                    Nothing found.
                  </div>
                ) : (
                  data?.map((element) => (
                    <Combobox.Option
                      key={element.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-1 pl-10 pr-4 bg-input-theme ${
                          active && "bg-teal-600 text-white"
                        }`
                      }
                      value={element}
                    >
                      {
                        ({ selected }) => {
                          if ("cnpjCpf" in element) {
                            return (
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                                onClick={() =>
                                  setSelecteds(
                                    (old: CompanyProvidersColumns[] | any) => {
                                      if (
                                        old &&
                                        old.some(
                                          (el: CompanyProvidersColumns | any) =>
                                            el.id === element.id
                                        )
                                      ) {
                                        return old;
                                      } else {
                                        return old
                                          ? [...old, element]
                                          : [element];
                                      }
                                    }
                                  )
                                }
                              >
                                {element?.cnpjCpf &&
                                  mask(element?.cnpjCpf, [
                                    "999.999.999-99",
                                    "99.999.999/9999-99",
                                  ])}{" "}
                                - {element?.nome}
                              </span>
                            );
                          } else {
                            return (
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                                onClick={() =>
                                  setSelecteds(
                                    (old: ProviderCompaniesColumns[] | any) => {
                                      if (
                                        old &&
                                        old.some(
                                          (
                                            el: ProviderCompaniesColumns | any
                                          ) => el.id === element.id
                                        )
                                      ) {
                                        return old;
                                      } else {
                                        return old
                                          ? [...old, element]
                                          : [element];
                                      }
                                    }
                                  )
                                }
                              >
                                {element?.cnpj &&
                                  mask(element?.cnpj, [
                                    "99.999.999/9999-99",
                                  ])}{" "}
                                - {element?.nomeFantasia}
                              </span>
                            );
                          }
                        }

                        // <>

                        //   <span
                        //     className={`block truncate ${
                        //       selected ? "font-medium" : "font-normal"
                        //     }`}
                        //     onClick={() =>
                        //       setSelecteds((old) => {
                        //         if (
                        //           old &&
                        //           old.some((el) => el.id === element.id)
                        //         ) {
                        //           return old;
                        //         } else {
                        //           return old ? [...old, element] : [element];
                        //         }
                        //       })
                        //     }
                        //   >

                        //     {element?.cnpjCpf &&
                        //       mask(element?.cnpjCpf, [
                        //         "99.999.999/9999-99",
                        //       ])}{" "}
                        //     - {element?.nome}
                        //   </span>
                        // </>
                      }
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      )}
    </div>
  );
};

export default HeadlessCombobox;
