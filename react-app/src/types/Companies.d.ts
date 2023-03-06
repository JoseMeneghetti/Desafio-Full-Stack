
    export interface Provider {
        id: number;
        cnpjCpf: string;
        nome: string;
        email: string;
        cep: string;
        rg?: any;
        dataNascimento?: any;
    }

    export interface Data {
        id: number;
        cnpj: string;
        nomeFantasia: string;
        cep: string;
        createdAt: Date;
        providers: Provider[];
    }

    export interface CompaniesT {
        data: Data[];
        totalElements: number;
        totalPages: number;
        page: number;
        size: number;
    }



