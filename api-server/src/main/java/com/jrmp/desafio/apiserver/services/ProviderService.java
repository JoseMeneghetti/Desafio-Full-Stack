package com.jrmp.desafio.apiserver.services;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;

import com.jrmp.desafio.apiserver.DTO.CepLaDTO;
import com.jrmp.desafio.apiserver.DTO.Provider.PageProviderDTO;
import com.jrmp.desafio.apiserver.DTO.Provider.ProviderDTO;
import com.jrmp.desafio.apiserver.exceptions.ResourceNotFoundException;
import com.jrmp.desafio.apiserver.model.Company;
import com.jrmp.desafio.apiserver.model.Provider;
import com.jrmp.desafio.apiserver.repository.ProviderRepository;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    public PageProviderDTO getAllProviders(String search, Pageable pageable) {

        Page<Provider> providers = providerRepository.findAllWithSearch(search, pageable);
        List<ProviderDTO> providersDTOs = providers.stream().map(ProviderDTO::new).collect(Collectors.toList());
        PageProviderDTO pageDTO = new PageProviderDTO(providersDTOs, providers.getTotalElements(),
                providers.getTotalPages(),
                providers.getNumber(),
                providers.getSize());
        return pageDTO;

    }

    public ProviderDTO findById(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider with ID: " + id + " not found!"));
        ProviderDTO providerDTO = new ProviderDTO(provider);
        return providerDTO;

    }

    public ProviderDTO findByCnpjCpf(String CnpjCpf) {
        Provider provider = providerRepository.findByCnpjCpf(CnpjCpf)
                .orElseThrow(() -> new ResourceNotFoundException("Provider with CnpjCpf: " + CnpjCpf + " not found!"));
        ProviderDTO providerDTO = new ProviderDTO(provider);
        return providerDTO;

    }

    public String addProvider(Provider provider) {

        if (provider.getCnpjCpf().length() != 11 && provider.getCnpjCpf().length() != 14) {
            throw new ResourceNotFoundException(
                    "CNPJ/CPF " + provider.getCnpjCpf() + " invalido, tente novamente.");

        }

        RestTemplate template = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        UriComponents uri = UriComponentsBuilder.newInstance().scheme("http").host("cep.la")
                .path(provider.getCep().toString()).build();

        ResponseEntity<CepLaDTO> address;

        try {
            address = template.exchange(uri.toUriString(), HttpMethod.GET, requestEntity,
                    CepLaDTO.class);

        } catch (RuntimeException e) {
            throw new ResourceNotFoundException("Cep " + provider.getCep() + " nao encontrado!");
        }

        if (provider.getCnpjCpf().length() == 11) {
            if (provider.getDataNascimento() == null) {
                throw new ResourceNotFoundException(
                        "Data de Nascimento invalida.");
            }

            if (address != null && address.getBody() != null) {
                CepLaDTO cepLaDTO = address.getBody();
                if (cepLaDTO != null && cepLaDTO.getUf().equals("PR")) {
                    if (cepLaDTO.getUf().equals("PR")) {
                        Date dataNascimento = provider.getDataNascimento();
                        Calendar dob = Calendar.getInstance();
                        dob.setTime(dataNascimento);
                        int yearDob = dob.get(Calendar.YEAR);
                        int monthDob = dob.get(Calendar.MONTH);
                        int dayDob = dob.get(Calendar.DAY_OF_MONTH);
                        Calendar now = Calendar.getInstance();
                        int yearNow = now.get(Calendar.YEAR);
                        int monthNow = now.get(Calendar.MONTH);
                        int dayNow = now.get(Calendar.DAY_OF_MONTH);
                        int age = yearNow - yearDob;
                        if (monthNow < monthDob || (monthNow == monthDob && dayNow < dayDob)) {
                            age--;
                        }

                        if (age < 18) {
                            throw new ResourceNotFoundException(
                                    "Fornecedores pessoa fisisca do estado do Parana (PR) tem que ser maior de idade.");
                        }
                    }
                }
            }

            if (provider.getRg() == null) {
                throw new ResourceNotFoundException("RG " + provider.getRg() + " invalido, tente novamente.");
            }
            if (provider.getRg().length() != 9) {
                throw new ResourceNotFoundException("RG " + provider.getRg() + " invalido, tente novamente.");
            }
        }

        Provider savedProvider = providerRepository.save(provider);

        List<Company> companies = provider.getCompanies();
        if (companies != null) {
            for (Company company : companies) {
                company.addProvider(savedProvider);
            }
        }
        return "Success!";

    }

    public String removeProvider(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider with ID: " + id + " not found!"));

        providerRepository.delete(provider);

        return "Success!";
    }

    public String updateProvider(Long id, Provider provider) {

        Provider updatedProvider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider with ID: " + id + " not found!"));

        if (provider.getCnpjCpf() != null) {
            if (provider.getCnpjCpf().length() != 11 && provider.getCnpjCpf().length() != 14) {
                throw new ResourceNotFoundException(
                        "CNPJ/CPF " + provider.getCnpjCpf() + " invalido, tente novamente.");

            }

            updatedProvider.setCnpjCpf(provider.getCnpjCpf());
        }

        if (provider.getNome() != null) {
            updatedProvider.setNome(provider.getNome());
        }
        if (provider.getEmail() != null) {
            updatedProvider.setEmail(provider.getEmail());
        }

        if (provider.getRg() != null) {
            updatedProvider.setRg(provider.getRg());
        }
        if (provider.getDataNascimento() != null) {
            updatedProvider.setDataNascimento(provider.getDataNascimento());
        }

        if (provider.getCep() != null) {
            ResponseEntity<CepLaDTO> address;

            RestTemplate template = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            UriComponents uri = UriComponentsBuilder.newInstance().scheme("http").host("cep.la")
                    .path(provider.getCep().toString()).build();

            try {
                address = template.exchange(uri.toUriString(), HttpMethod.GET, requestEntity,
                        CepLaDTO.class);

            } catch (RuntimeException e) {
                throw new ResourceNotFoundException("Cep " + provider.getCep() + " nao encontrado!");
            }

            if (provider.getCnpjCpf().length() == 11) {
                if (provider.getDataNascimento() == null) {
                    throw new ResourceNotFoundException(
                            "Data de Nascimento invalida.");
                }

                if (address != null && address.getBody() != null) {
                    CepLaDTO cepLaDTO = address.getBody();
                    if (cepLaDTO != null && cepLaDTO.getUf().equals("PR")) {
                        if (cepLaDTO.getUf().equals("PR")) {
                            Date dataNascimento = provider.getDataNascimento();
                            Calendar dob = Calendar.getInstance();
                            dob.setTime(dataNascimento);
                            int yearDob = dob.get(Calendar.YEAR);
                            int monthDob = dob.get(Calendar.MONTH);
                            int dayDob = dob.get(Calendar.DAY_OF_MONTH);
                            Calendar now = Calendar.getInstance();
                            int yearNow = now.get(Calendar.YEAR);
                            int monthNow = now.get(Calendar.MONTH);
                            int dayNow = now.get(Calendar.DAY_OF_MONTH);
                            int age = yearNow - yearDob;
                            if (monthNow < monthDob || (monthNow == monthDob && dayNow < dayDob)) {
                                age--;
                            }

                            if (age < 18) {
                                throw new ResourceNotFoundException(
                                        "Fornecedores pessoa fisisca do estado do Parana (PR) tem que ser maior de idade.");
                            }
                        }
                    }
                }

                if (provider.getRg() == null) {
                    throw new ResourceNotFoundException("RG " + provider.getRg() + " invalido, tente novamente.");
                }
                if (provider.getRg().length() != 9) {
                    throw new ResourceNotFoundException("RG " + provider.getRg() + " invalido, tente novamente.");
                }
            }

            updatedProvider.setCep(provider.getCep());
        }

        if (provider.getCompanies() != null) {
            List<Company> companiesToRemove = updatedProvider.getCompanies();
            if (companiesToRemove != null) {
                for (Company company : companiesToRemove) {
                    company.getProviders().remove(updatedProvider);
                }
            }
            updatedProvider.setCompanies(null);

            List<Company> newCompanies = provider.getCompanies();
            if (newCompanies != null) {
                for (Company company : newCompanies) {
                    company.addProvider(updatedProvider);
                }
                updatedProvider.setCompanies(newCompanies);
            }
        }

        providerRepository.save(updatedProvider);

        return "Success!";
    }
}
