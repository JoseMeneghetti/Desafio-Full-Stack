import axios from "axios";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Cep, CompanyProvidersColumns } from "../../../types/Global";
import FormInput from "../../common/FormComponents/FormInput";
import CreateFunctions from "../../lib/CreateFunctions";
import { mask, unMask } from "remask";
import HeadlessDialog from "../../common/Dialog/HeadlessDialog";
import Validation from "../../common/Dialog/Alerts/ValidationDialog";
import useTableHook from "../../hooks/UseTableContext";
import { Data } from "../../../types/Companies";
import { Data as ProviderData } from "../../../types/Providers";
import EditFunctions from "../../lib/EditFunctions";
import HeadlessCombobox from "../../common/FormComponents/FormCombobox";
import CompaniesProvidersTable from "./CompaniesProvidersTable";
import Spinner from "../../common/Spinner/Spinner";
import DeleteDialog from "../../common/Dialog/Alerts/DeleteDialog";
import { X } from "phosphor-react";
import useDeviceType from "../../hooks/UseDeviceType";
import MobileCompaniesProvidersTable from "./MobileCompaniesProvidersTable";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  edit?: Data;
}

const CompaniesForm = ({ setIsOpen, edit }: Props) => {
  const useTable = useTableHook();
  const useDevice = useDeviceType();
  const [isValidCep, setIsValidCep] = useState<Cep>();
  const [cep, setCep] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenValidation, setIsOpenValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [providers, setProviders] = useState<CompanyProvidersColumns[]>();

  const [selectedProviders, setSelectedProviders] =
    useState<CompanyProvidersColumns[]>();

  const [searchProviders, setSearchProviders] = useState("");

  const handleCreateCompany = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      const form = new FormData(event.target as HTMLFormElement);

      const dataForm = Object.fromEntries(form);

      const providers = selectedProviders?.map((el) => {
        return { id: el.id };
      });

      const bodyContent = JSON.stringify({
        cnpj: unMask(dataForm.cnpj),
        nomeFantasia: dataForm.nomeFantasia,
        cep: unMask(dataForm.cep),
        providers: providers,
      });

      if (unMask(dataForm.cnpj).length !== 14) {
        setValidationMessage(
          `CNPJ ${dataForm.cnpj} invalido, tente novamente.`
        );
        setIsOpenValidation(true);
        return;
      }

      if (edit && edit?.id) {
        await EditFunctions("companies", bodyContent, edit?.id);
      } else {
        try {
          await axios
            .get(
              `${import.meta.env.VITE_APP_DOMAIN}/companies/document/${unMask(
                dataForm?.cnpj
              )}`
            )
            .then((resp) => {
              if (resp.data)
                setValidationMessage(
                  `o CNPJ ${dataForm?.cnpj} ja esta sendo utilizado.`
                );
              setIsOpenValidation(true);
            });

          return;
        } catch (error: Error | any) {
          if (error?.response?.status === 404) {
            await CreateFunctions("companies", bodyContent);
          }
        }
      }
      useTable?.refreshTable();
      setIsOpen && setIsOpen(false);
      setIsLoading && setIsLoading(false);
    },
    [selectedProviders]
  );

  useEffect(() => {
    if (edit?.cep) {
      setCep(mask(edit?.cep, ["99999-999"]));
    }
  }, [edit?.cep]);

  useEffect(() => {
    if (cep.length === 9) {
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
    } else {
      setIsValidCep(undefined);
    }
  }, [cep]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_DOMAIN}/providers`, {
        headers: {
          Accept: "application/json",
        },
        params: {
          search: searchProviders,
          size: 99,
        },
      })
      .then((response) => {
        setProviders(
          response.data.data.map((el: ProviderData) => {
            return {
              id: el.id,
              nome: el.nome,
              cnpjCpf: el.cnpjCpf,
              email: el.email,
            };
          })
        );
      })
      .catch((error) => console.log(error));
  }, [searchProviders]);

  useEffect(() => {
    if (edit?.providers && edit?.providers.length) {
      const newProviders = edit?.providers.map((el) => {
        return {
          id: el.id,
          nome: el.nome,
          cnpjCpf: el.cnpjCpf,
          email: el.email,
        };
      });
      setSelectedProviders(newProviders);
    }
  }, [edit?.providers]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleCreateCompany}>
      <div className="flex justify-between">
        <h1 className="text-3xl py-4">Empresa</h1>
        <X
          size={24}
          color="#fff"
          weight="bold"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          id="nomeFanstaia"
          name="nomeFantasia"
          label="Nome Fantasia"
          fullWidth
          required
          defaultValue={edit && edit?.nomeFantasia}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          id="cnpj"
          name="cnpj"
          label="CNPJ"
          fullWidth
          required
          onChange={(e) =>
            (e.currentTarget.value = mask(e.currentTarget.value, [
              "99.999.999/9999-99",
            ]))
          }
          defaultValue={edit && mask(edit?.cnpj, ["99.999.999/9999-99"])}
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
        <div className="flex flex-col gap-4 shadow-theme rounded-md p-4">
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
      <div className="relative">
        <HeadlessCombobox
          label="Fornecedores"
          data={providers}
          setSearch={setSearchProviders}
          search={searchProviders}
          setSelecteds={setSelectedProviders}
        />
        {useDevice === "Phone" ? (
          <MobileCompaniesProvidersTable
            data={selectedProviders ?? []}
            defaultData={[]}
            setSelectedProviders={setSelectedProviders}
          />
        ) : (
          <CompaniesProvidersTable
            data={selectedProviders ?? []}
            defaultData={[]}
            setSelectedProviders={setSelectedProviders}
          />
        )}
      </div>
      <div className="flex justify-end py-4 gap-4">
        {edit && (
          <HeadlessDialog
            dialogContent={
              <DeleteDialog
                setIsOpen={setIsOpenDelete}
                message={`Confirma que deseja delete a Empresa ${edit?.nomeFantasia} ?`}
                formType="companies"
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
          <Validation
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

export default CompaniesForm;
