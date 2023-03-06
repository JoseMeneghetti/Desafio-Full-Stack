package com.jrmp.desafio.apiserver.DTO.Company;

import java.util.List;

import lombok.Data;

@Data
public class PageCompanyDTO {
    private List<CompanyDTO> data;
    private long totalElements;
    private long totalPages;
    private int page;
    private int size;

    public PageCompanyDTO(List<CompanyDTO> data, long totalElements, long totalPages, int page, int size) {
        this.data = data;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.page = page;
        this.size = size;
    }
}
