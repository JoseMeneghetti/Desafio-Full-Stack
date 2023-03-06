export interface SortState {
  sortName: string;
  sortValue: string;
}
export interface Cep {
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
}

export interface CompanyProvidersColumns {
  id: number;
  nome: string;
  cnpjCpf: string;
  email: string;
}

export interface ProviderCompaniesColumns {
  id: number;
  nomeFantasia: string;
  cnpj: string;
}
