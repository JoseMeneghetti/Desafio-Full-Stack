package com.jrmp.desafio.apiserver.DTO.Provider;

import java.util.List;

import lombok.Data;

@Data
public class PageProviderDTO {
    private List<ProviderDTO> data;
    private long totalElements;
    private long totalPages;
    private int page;
    private int size;

    public PageProviderDTO(List<ProviderDTO> data, long totalElements, long totalPages, int page, int size) {
        this.data = data;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.page = page;
        this.size = size;
    }

}
