package com.jrmp.desafio.apiserver.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.jrmp.desafio.apiserver.model.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCnpj(String cnpj);

    @Query("SELECT p FROM Company p WHERE LOWER(p.nomeFantasia) LIKE %:keyword% OR LOWER(p.cnpj) LIKE %:keyword% OR LOWER(p.cep) LIKE %:keyword%")
    Page<Company> findAllSearch(String keyword, Pageable pageable);

    default Page<Company> findAllWithSearch(String keyword, Pageable pageable) {
        if (StringUtils.hasText(keyword)) {
            return findAllSearch(keyword, pageable);
        } else {
            return findAll(pageable);
        }
    }
}
