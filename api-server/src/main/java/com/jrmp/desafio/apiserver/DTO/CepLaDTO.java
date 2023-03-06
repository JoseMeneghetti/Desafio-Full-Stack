package com.jrmp.desafio.apiserver.DTO;

import lombok.Getter;

@Getter
public class CepLaDTO {
    private String cep;
    private String uf;
    private String cidade;
    private String bairro;
    private String logradouro;

}
