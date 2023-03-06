import axios from "axios";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Cep, ProviderCompaniesColumns } from "../../../types/Global";
import FormInput from "../../common/FormComponents/FormInput";
import CreateFunctions from "../../lib/CreateFunctions";
import { mask, unMask } from "remask";
import HeadlessDialog from "../../common/Dialog/HeadlessDialog";
import ValidationDialog from "../../common/Dialog/Alerts/ValidationDialog";
import useTableHook from "../../hooks/UseTableContext";
import { Data } from "../../../types/Providers";
import { Data as CompaniesData } from "../../../types/Companies";

import EditFunctions from "../../lib/EditFunctions";
import DeleteDialog from "../../common/Dialog/Alerts/DeleteDialog";
import Spinner from "../../common/Spinner/Spinner";
import HeadlessCombobox from "../../common/FormComponents/FormCombobox";
import ProvidersCompaniesTable from "./ProvidersCompaniesTable";
import useDeviceType from "../../hooks/UseDeviceType";
import MobileProvidersCompaniesTable from "./MobileProvidersCompaniesTable";
import { X } from "phosphor-react";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  edit?: Data;
}

const ProvidersForm = ({ setIsOpen, edit }: Props) => {
  const useTable = useTableHook();
  const useDevice = useDeviceType();
  const [isValidCep, setIsValidCep] = useState<Cep>();
  const [isCnpjOrCpf, setIsCnpjOrCpf] = useState<"cnpj" | "cpf" | null>(null);
  const [cep, setCep] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [companies, setCompanies] = useState<ProviderCompaniesColumns[]>();

  const [selectedCompanies, setSelectedCompanies] =
    useState<ProviderCompaniesColumns[]>();

  const [searchCompanies, setSearchCompanies] = useState("");

  const [isOpenValidation, setIsOpenValidation] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleCreateProvider = useCallback(
    async (event: FormEvent) => {
      setIsLoading(true);

      event.preventDefault();

      const form = new FormData(event.target as HTMLFormElement);

      const dataForm = Object.fromEntries(form);

      const companies = selectedCompanies?.map((el) => {
        return { id: el.id };
      });

      const bodyContent = JSON.stringify({
        cnpjCpf: unMask(dataForm?.cnpjCpf),
        nome: dataForm.nome,
        email: dataForm.email,
        cep: unMask(dataForm?.cep),
        rg: dataForm?.rg ? unMask(dataForm?.rg) : null,
        dataNascimento: dataForm?.dataNascimento ?? null,
        companies: companies,
      });

      //validation cnpj/cpf
      if (
        unMask(dataForm?.cnpjCpf).length !== 14 &&
        unMask(dataForm?.cnpjCpf).length !== 11
      ) {
        setValidationMessage(
          `CNPJ/CPF ${dataForm.cnpjCpf} invalido, tente novamente.`
        );
        setIsOpenValidation(true);
        return;
      }

      //validation rg
      if (
        isCnpjOrCpf === "cpf" &&
        dataForm?.rg &&
        unMask(dataForm?.rg).length !== 9
      ) {
        setValidationMessage(`RG ${dataForm.rg} invalido, tente novamente.`);
        setIsOpenValidation(true);
        return;
      }

      if (dataForm?.dataNascimento && isValidCep && isValidCep.uf === "PR") {
        const birthDate = new Date(dataForm?.dataNascimento.toString());

        const today = new Date();
        const legal_age = 18;
        let age = today.getFullYear() - birthDate.getFullYear();
        const thisMonth = today.getMonth() + 1;
        const birthMonth = birthDate.getMonth() + 1;

        if (
          thisMonth < birthMonth ||
          (thisMonth === birthMonth && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < legal_age) {
          setValidationMessage(
            `Fornecedores pessoa fisisca do estado do Parana (PR) tem que ser maior de idade.`
          );
          setIsOpenValidation(true);
          return;
        }
      }

      if (edit && edit?.id) {
        await EditFunctions("providers", bodyContent, edit.id);
      } else {
        try {
          await axios
            .get(
              `${import.meta.env.VITE_APP_DOMAIN}/providers/document/${unMask(
                dataForm?.cnpjCpf
              )}`
            )
            .then((resp) => {
              if (resp.data)
                setValidationMessage(
                  `o CNPJ/CPF ${dataForm?.cnpjCpf} ja esta sendo utilizado.`
                );
              setIsOpenValidation(true);
            });

          return;
        } catch (error: Error | any) {
          if (error?.response?.status === 404) {
            await CreateFunctions("providers", bodyContent);
          }
        }
      }
      setIsOpen && setIsOpen(false);
      useTable?.refreshTable();
      setIsLoading(false);
    },
    [isCnpjOrCpf, isValidCep, selectedCompanies]
  );

  useEffect(() => {
    if (edit?.cep) {
      setCep(mask(edit?.cep, ["99999-999"]));
    }
    if (edit?.cnpjCpf?.length === 11) {
      setIsCnpjOrCpf("cpf");
    } else if (edit?.cnpjCpf?.length === 14) {
      setIsCnpjOrCpf("cnpj");
    } else {
      setIsCnpjOrCpf(null);
    }
  }, [edit]);

  useEffect(() => {
    if (cep?.length === 9) {
      axios
        .get(`http://cep.la/${cep}`, {
          headers: {
            Accept: "application/json",
          },
        })
        .then((response) => {
          if (response.data && response.data.cep) {
            setIsValidCep(response.data);
          } else {
            setIsValidCep(undefined);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [cep]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_DOMAIN}/companies`, {
        headers: {
          Accept: "application/json",
        },
        params: {
          search: searchCompanies,
          size: 99,
        },
      })
      .then((response) => {
        setCompanies(
          response.data.data.map((el: CompaniesData) => {
            return {
              id: el.id,
              nomeFantasia: el.nomeFantasia,
              cnpj: el.cnpj,
            };
          })
        );
      })
      .catch((error) => console.log(error));
  }, [searchCompanies]);

  useEffect(() => {
    if (edit?.companies && edit?.companies.length) {
      const newCompanies = edit?.companies.map((el) => {
        return {
          id: el.id,
          nomeFantasia: el.nomeFantasia,
          cnpj: el.cnpj,
        };
      });
      setSelectedCompanies(newCompanies);
    }
  }, [edit?.companies]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleCreateProvider}>
      <div className="flex justify-between">
        <h1 className="text-3xl py-4">Fornecedor</h1>
        <X
          size={24}
          color="#fff"
          weight="bold"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          id="nome"
          name="nome"
          label="Nome"
          fullWidth
          required
          defaultValue={edit?.nome ?? ""}
        />
        <FormInput
          id="cnpjCpf"
          name="cnpjCpf"
          label="CNPJ/CPF"
          fullWidth
          required
          onChange={(e) => {
            const originalValue = unMask(e.currentTarget.value);
            const maskValue = mask(originalValue, [
              "999.999.999-99",
              "99.999.999/9999-99",
            ]);
            e.currentTarget.value = maskValue;
          }}
          onBlurCapture={(e) => {
            if (unMask(e.currentTarget.value).length === 11) {
              setIsCnpjOrCpf("cpf");
            } else if (unMask(e.currentTarget.value).length === 14) {
              setIsCnpjOrCpf("cnpj");
            } else {
              setIsCnpjOrCpf(null);
            }
          }}
          defaultValue={
            edit &&
            mask(edit?.cnpjCpf, ["999.999.999-99", "99.999.999/9999-99"])
          }
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          id="email"
          name="email"
          label="E-Mail"
          type="email"
          fullWidth
          required
          defaultValue={edit && edit?.email}
        />
        <FormInput
          id="cep"
          name="cep"
          label="CEP"
          fullWidth
          required
          onChange={(e) =>
            (e.currentTarget.value = mask(e.currentTarget.value, ["99999-999"]))
          }
          onBlurCapture={(e) => {
            if (e.currentTarget.value.length === 9) {
              setCep(e.currentTarget.value);
            } else {
              setCep(e.currentTarget.value);
              setIsValidCep(undefined);
            }
          }}
          defaultValue={edit && mask(edit?.cep, ["99999-999"])}
        />
      </div>

      {isValidCep && (
        <div className="flex flex-col gap-4 shadow-theme rounded-md p-4 my-4">
          <div className="flex flex-col md:flex-row gap-4">
            <FormInput
              id="logradouro"
              name="logradouro"
              label="Rua"
              fullWidth
              value={isValidCep.logradouro}
              disabled
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <FormInput
              id="bairro"
              name="bairro"
              label="Bairro"
              fullWidth
              value={isValidCep.bairro}
              disabled
            />
            <FormInput
              id="cidade"
              name="cidade"
              label="Cidade"
              fullWidth
              value={isValidCep.cidade}
              disabled
            />
            <FormInput
              id="uf"
              name="uf"
              label="UF"
              fullWidth
              value={isValidCep.uf}
              disabled
            />
          </div>
        </div>
      )}
      {isCnpjOrCpf === "cpf" && (
        <div className="flex flex-col md:flex-row gap-4">
          <FormInput
            id="rg"
            name="rg"
            label="RG"
            fullWidth
            required
            onChange={(e) =>
              (e.currentTarget.value = mask(e.currentTarget.value, [
                "99.999.999-S",
              ]))
            }
            defaultValue={edit?.rg && mask(edit?.rg, ["99.999.999-S"])}
          />
          <FormInput
            id="dataNascimento"
            name="dataNascimento"
            label="Data Nascimento"
            fullWidth
            required
            type="date"
            min="1923-01-01"
            max="2023-12-31"
            defaultValue={
              edit?.dataNascimento &&
              new Date(edit?.dataNascimento).toISOString().split("T")[0]
            }
          />
        </div>
      )}
      <div className="relative">
        <HeadlessCombobox
          label="Empresas"
          data={companies}
          setSearch={setSearchCompanies}
          search={searchCompanies}
          setSelecteds={setSelectedCompanies}
        />
        {useDevice === "Phone" ? (
          <MobileProvidersCompaniesTable
            data={selectedCompanies ?? []}
            defaultData={[]}
            setSelectedCompanies={setSelectedCompanies}
          />
        ) : (
          <ProvidersCompaniesTable
            data={selectedCompanies ?? []}
            defaultData={[]}
            setSelectedCompanies={setSelectedCompanies}
          />
        )}
      </div>
      <div className="flex justify-end py-4 gap-4">
        {edit && (
          <HeadlessDialog
            dialogContent={
              <DeleteDialog
                setIsOpen={setIsOpenDelete}
                message={`Confirma que deseja delete o fornecedor ${edit.nome} ?`}
                formType="providers"
                id={edit?.id}
              />
            }
            setIsOpen={setIsOpenDelete}
            isOpen={isOpenDelete}
            customClass={"!w-fit"}
            button={
              <button
                className="flex self-end w-fit items-center border-[1px] border-black bg-rose-600 rounded-full text-base text-white font-bold px-8 py-1 disabled:bg-gray-300"
                onClick={(e) => {
                  setIsOpenDelete(true);
                  e.preventDefault();
                }}
              >
                Deletar
              </button>
            }
          />
        )}

        <button
          className="border-[1px] border-black bg-teal-600 rounded-full text-base text-white font-bold px-8 py-1 disabled:bg-gray-300"
          type="submit"
          disabled={!isValidCep}
        >
          {edit ? "Editar" : "Salvar"}
        </button>
      </div>
      <HeadlessDialog
        dialogContent={
          <ValidationDialog
            setIsOpen={setIsOpenValidation}
            message={validationMessage}
            setIsLoading={setIsLoading}
          />
        }
        setIsOpen={setIsOpenValidation}
        isOpen={isOpenValidation}
        customClass={"!w-fit"}
      />
      {isLoading && (
        <div className="fixed inset-0 z-20 w-full h-full flex justify-center items-center bg-black bg-opacity-40 top-0 left-0">
          <Spinner size="h-20 w-20" />
        </div>
      )}
    </form>
  );
};

export default ProvidersForm;
