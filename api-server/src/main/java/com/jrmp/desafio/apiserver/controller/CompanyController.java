package com.jrmp.desafio.apiserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.jrmp.desafio.apiserver.DTO.Company.CompanyDTO;
import com.jrmp.desafio.apiserver.DTO.Company.PageCompanyDTO;
import com.jrmp.desafio.apiserver.model.Company;

import com.jrmp.desafio.apiserver.services.CompanyService;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "*", allowedHeaders = "*") // TODO Front end URL
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public PageCompanyDTO getAllCompanies(String search, Pageable pageable) {
        return companyService.getAllCompanies(search, pageable);
    }

    @GetMapping("/{id}")
    public CompanyDTO findById(@PathVariable Long id) {
        return companyService.findById(id);
    }

    @GetMapping("/document/{cnpj}")
    public CompanyDTO findByCnpj(@PathVariable String cnpj) {
        return companyService.findByCnpj(cnpj);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String addCompany(@RequestBody Company company) {

        return companyService.addCompany(company);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String removeCompany(@PathVariable Long id) {
        return companyService.removeCompany(id);

    }

    @PatchMapping("/{id}")
    public String update(@PathVariable Long id, @RequestBody Company company) {

        return companyService.updateCompany(id, company);
    }
}