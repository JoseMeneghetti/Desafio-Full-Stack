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

import com.jrmp.desafio.apiserver.DTO.Provider.PageProviderDTO;
import com.jrmp.desafio.apiserver.DTO.Provider.ProviderDTO;
import com.jrmp.desafio.apiserver.model.Provider;

import com.jrmp.desafio.apiserver.services.ProviderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/providers")
@CrossOrigin(origins = "*", allowedHeaders = "*") // TODO Front end URL
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping
    public PageProviderDTO getAllProviders(String search, Pageable pageable) {

        return providerService.getAllProviders(search, pageable);
    }

    @GetMapping("/{id}")
    public ProviderDTO findById(@PathVariable Long id) {

        return providerService.findById(id);
    }

    @GetMapping("/document/{cnpjCpf}")
    public ProviderDTO findByCnpjCpf(@PathVariable String cnpjCpf) {

        return providerService.findByCnpjCpf(cnpjCpf);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String addProvider(@Valid @RequestBody Provider provider) {

        return providerService.addProvider(provider);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String removeProvider(@PathVariable Long id) {
        return providerService.removeProvider(id);
    }

    @PatchMapping("/{id}")
    public String updateProvider(@PathVariable Long id, @RequestBody Provider provider) {

        return providerService.updateProvider(id, provider);
    }

}