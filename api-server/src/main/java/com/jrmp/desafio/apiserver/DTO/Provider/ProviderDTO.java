package com.jrmp.desafio.apiserver.DTO.Provider;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.jrmp.desafio.apiserver.DTO.Company.GetCompanyDTO;
import com.jrmp.desafio.apiserver.model.Provider;

import lombok.Data;

@Data
public class ProviderDTO {
    private Long id;
    private String cnpjCpf;
    private String nome;
    private String email;
    private String cep;
    private String rg;
    private Date dataNascimento;
    private Date createdAt;
    private List<GetCompanyDTO> companies;

    public ProviderDTO(Provider provider) {

        this.id = provider.getId();
        this.cnpjCpf = provider.getCnpjCpf();
        this.nome = provider.getNome();
        this.cep = provider.getCep();
        this.email = provider.getEmail();
        this.rg = provider.getRg();
        this.dataNascimento = provider.getDataNascimento();
        this.createdAt = provider.getCreatedAt();

        this.companies = provider.getCompanies().stream().map(GetCompanyDTO::new).collect(Collectors.toList());
    }

}