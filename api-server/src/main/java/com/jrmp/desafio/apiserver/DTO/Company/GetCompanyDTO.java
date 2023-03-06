package com.jrmp.desafio.apiserver.DTO.Company;

import java.util.Date;

import com.jrmp.desafio.apiserver.model.Company;

import lombok.Data;

@Data
public class GetCompanyDTO {

    private Long id;
    private String cnpj;
    private String nomeFantasia;
    private String cep;
    private Date createdAt;

    public GetCompanyDTO(Company company) {

        this.id = company.getId();
        this.nomeFantasia = company.getNomeFantasia();
        this.cnpj = company.getCnpj();
        this.cep = company.getCep();
        this.createdAt = company.getCreatedAt();

    }

}
