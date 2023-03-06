package com.jrmp.desafio.apiserver.DTO.Company;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.jrmp.desafio.apiserver.DTO.Provider.GetProviderDTO;
import com.jrmp.desafio.apiserver.model.Company;

import lombok.Data;

@Data
public class CompanyDTO {

    private Long id;
    private String cnpj;
    private String nomeFantasia;
    private String cep;
    private Date createdAt;
    private List<GetProviderDTO> providers;

    public CompanyDTO(Company company) {

        this.id = company.getId();
        this.nomeFantasia = company.getNomeFantasia();
        this.cnpj = company.getCnpj();
        this.cep = company.getCep();
        this.createdAt = company.getCreatedAt();
        this.providers = company.getProviders().stream().map(GetProviderDTO::new).collect(Collectors.toList());
    }

}
