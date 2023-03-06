package com.jrmp.desafio.apiserver.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.jrmp.desafio.apiserver.model.Provider;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Optional<Provider> findByCnpjCpf(String cnpjCpf);

    @Query("SELECT p FROM Provider p WHERE LOWER(p.nome) LIKE %:keyword% OR LOWER(p.cnpjCpf) LIKE %:keyword% OR LOWER(p.email) LIKE %:keyword% OR LOWER(p.cep) LIKE %:keyword%")
    Page<Provider> findAllSearch(String keyword, Pageable pageable);

    default Page<Provider> findAllWithSearch(String keyword, Pageable pageable) {
        if (StringUtils.hasText(keyword)) {
            return findAllSearch(keyword, pageable);
        } else {
            return findAll(pageable);
        }
    }
}
