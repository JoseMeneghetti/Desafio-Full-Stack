package com.jrmp.desafio.apiserver.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.jrmp.desafio.apiserver.DTO.CepLaDTO;
import com.jrmp.desafio.apiserver.DTO.Company.CompanyDTO;
import com.jrmp.desafio.apiserver.DTO.Company.PageCompanyDTO;
import com.jrmp.desafio.apiserver.exceptions.ResourceNotFoundException;
import com.jrmp.desafio.apiserver.model.Company;
import com.jrmp.desafio.apiserver.model.Provider;
import com.jrmp.desafio.apiserver.repository.CompanyRepository;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public PageCompanyDTO getAllCompanies(String search, Pageable pageable) {
        Page<Company> companies = companyRepository.findAllWithSearch(search, pageable);
        List<CompanyDTO> companyDTOs = companies.stream().map(CompanyDTO::new).collect(Collectors.toList());
        PageCompanyDTO pageDTO = new PageCompanyDTO(companyDTOs, companies.getTotalElements(),
                companies.getTotalPages(), companies.getNumber(),
                companies.getSize());

        return pageDTO;
    }

    public CompanyDTO findById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company with ID: " + id + " not found!"));
        CompanyDTO companyDTO = new CompanyDTO(company);
        return companyDTO;
    }

    public CompanyDTO findByCnpj(String cnpj) {
        Company company = companyRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new ResourceNotFoundException("Company with CNPJ: " + cnpj + " not found!"));
        CompanyDTO companyDTO = new CompanyDTO(company);
        return companyDTO;
    }

    public String addCompany(Company company) {

        if (company.getCnpj().length() != 14) {
            throw new ResourceNotFoundException(
                    "CNPJ " + company.getCnpj() + " invalido, tente novamente.");

        }

        RestTemplate template = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        UriComponents uri = UriComponentsBuilder.newInstance().scheme("http").host("cep.la")
                .path(company.getCep().toString()).build();

        try {
            template.exchange(uri.toUriString(), HttpMethod.GET, requestEntity,
                    CepLaDTO.class);
        } catch (RuntimeException e) {
            throw new ResourceNotFoundException("Cep " + company.getCep() + " nao encontrado!");
        }

        Company savedCompany = companyRepository.save(company);

        List<Provider> providers = company.getProviders();
        if (providers != null) {
            for (Provider provider : providers) {
                provider.addCompany(savedCompany);
            }
        }
        return "Success!";
    }

    public String removeCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company with ID: " + id + " not found!"));

        companyRepository.delete(company);

        return "Success";
    }

    public String updateCompany(Long id, Company company) {
        Company updatedCompany = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company with ID: " + id + " not found!"));

        if (company.getCnpj() != null) {
            if (company.getCnpj().length() != 14) {
                throw new ResourceNotFoundException(
                        "CNPJ " + company.getCnpj() + " invalido, tente novamente.");

            }

            updatedCompany.setCnpj(company.getCnpj());
        }

        if (company.getNomeFantasia() != null) {
            updatedCompany.setNomeFantasia(company.getNomeFantasia());
        }

        if (company.getCep() != null) {
            RestTemplate template = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            UriComponents uri = UriComponentsBuilder.newInstance().scheme("http").host("cep.la")
                    .path(company.getCep().toString()).build();

            try {
                template.exchange(uri.toUriString(), HttpMethod.GET, requestEntity,
                        CepLaDTO.class);
            } catch (RuntimeException e) {
                throw new ResourceNotFoundException("Cep " + company.getCep() + " nao encontrado!");
            }

            updatedCompany.setCep(company.getCep());
        }

        if (company.getProviders() != null) {
            List<Provider> providersToRemove = updatedCompany.getProviders();
            if (providersToRemove != null) {
                for (Provider provider : providersToRemove) {
                    provider.getCompanies().remove(updatedCompany);
                }
            }
            updatedCompany.setProviders(null);

            List<Provider> newProviders = company.getProviders();
            if (newProviders != null) {
                for (Provider provider : newProviders) {
                    provider.addCompany(updatedCompany);
                }
                updatedCompany.setProviders(newProviders);
            }
        }

        companyRepository.save(updatedCompany);

        return "Successo!";
    }

}
