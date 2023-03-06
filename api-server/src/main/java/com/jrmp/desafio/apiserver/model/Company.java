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
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.PrePersist;
import jakarta.persistence.JoinColumn;

import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotNull(message = "CNPJ é um campo obrigatorio.")
    private String cnpj;

    @Column(name = "nome_fantasia")
    @NotNull(message = "Nome Fantasia é um campo obrigatorio.")
    private String nomeFantasia;

    @Column
    @NotNull(message = "Cep é um campo obrigatorio.")
    private String cep;

    @ToString.Exclude
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "company_provider", joinColumns = @JoinColumn(name = "company_id"), inverseJoinColumns = @JoinColumn(name = "provider_id"))
    private List<Provider> providers;

    @Column(name="created_at")
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    public void addProvider(Provider provider) {
        if (providers == null) {
            providers = new ArrayList<>();
        }
        providers.add(provider);
    }
}
