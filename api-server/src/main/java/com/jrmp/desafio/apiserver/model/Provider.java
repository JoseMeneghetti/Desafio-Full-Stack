package com.jrmp.desafio.apiserver.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.PrePersist;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, name = "cnpj_cpf")
    @NotNull(message = "CNPJ/CPF é um campo obrigatorio.")
    private String cnpjCpf;

    @Column
    @NotNull(message = "Nome é um campo obrigatorio.")
    private String nome;

    @Column
    @NotNull(message = "E-mail é um campo obrigatorio.")
    private String email;

    @Column
    @NotNull(message = "CEP é um campo obrigatorio.")
    private String cep;

    @Column
    private String rg;

    @Column(name = "data_nascimento")
    private Date dataNascimento;

    @Column(name = "created_at")
    private Date createdAt;

    @ToString.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "company_provider", joinColumns = @JoinColumn(name = "provider_id"), inverseJoinColumns = @JoinColumn(name = "company_id"))
    private List<Company> companies;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    public void addCompany(Company company) {
        if (companies == null) {
            companies = new ArrayList<>();
        }
        companies.add(company);
    }
}
