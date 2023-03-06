export interface Companies {
  id: number;
  cnpj: string;
  nomeFantasia: string;
  cep: string;
}

export interface Data {
  id: number;
  cnpjCpf: string;
  nome: string;
  email: string;
  cep: string;
  rg?: string;
  dataNascimento?: string;
  createdAt: Date;
  companies: Companies[];
}

export interface ProvidersT {
  data: Data[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
