CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    cnpj TEXT UNIQUE NOT NULL,
    nome_fantasia TEXT NOT NULL,
    cep TEXT NOT NULL,
    created_at timestamp NOT NULL
);

CREATE TABLE providers (
    id SERIAL PRIMARY KEY,
    cnpj_cpf TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    cep TEXT NOT NULL,
    rg TEXT,
    data_nascimento DATE,
    created_at timestamp NOT NULL
);

CREATE TABLE company_provider (
    company_id SERIAL REFERENCES companies(id) ON DELETE CASCADE,
    provider_id SERIAL REFERENCES providers(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, provider_id)
);