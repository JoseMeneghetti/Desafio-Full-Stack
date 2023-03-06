package com.jrmp.desafio.apiserver.DTO.Provider;

import java.util.Date;

import com.jrmp.desafio.apiserver.model.Provider;

import lombok.Data;

@Data
public class GetProviderDTO {
    private Long id;
    private String cnpjCpf;
    private String nome;
    private String email;
    private String cep;
    private String rg;
    private Date dataNascimento;
    private Date createdAt;

    public GetProviderDTO(Provider provider) {

        this.id = provider.getId();
        this.cnpjCpf = provider.getCnpjCpf();
        this.nome = provider.getNome();
        this.cep = provider.getCep();
        this.email = provider.getEmail();
        this.rg = provider.getRg();
        this.dataNascimento = provider.getDataNascimento();
        this.createdAt = provider.getCreatedAt();
    }

}