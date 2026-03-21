# Architecture - Agência de Viagens API

Este documento descreve a arquitetura do backend, suas camadas, responsabilidades e fluxo de dados.


# Visão Geral

A aplicação segue o padrão de arquitetura em camadas (Layered Architecture), com separação clara de responsabilidades.

```text
Client → Controller → Service → Repository → Database
```

---

# Estrutura de Camadas

## Controller Layer

Responsável por:

* Receber requisições HTTP
* Validar dados de entrada
* Delegar para a camada de serviço
* Retornar respostas (JSON)

Tecnologias:

* Spring Web

## Service Layer

O coração do sistema 

Responsável por:

* Implementar regras de negócio
* Processar dados
* Controlar fluxo da aplicação
* Garantir consistência

Exemplo de responsabilidades:

* Cálculo de preço total
* Controle de status do contrato
* Geração de token

##  Repository Layer

Responsável por:

* Comunicação com o banco de dados
* Operações CRUD
* Queries automáticas via JPA

Tecnologias:

* Spring Data JPA

## Model Layer (Entities)

Representa as tabelas do banco.

Principais entidades:

* Travel
* Contract
* Passenger

Tecnologias:

* JPA / Hibernate

# Fluxo de Dados

## Criação de contrato

```text
POST /contracts
   ↓
Controller
   ↓
Service (cria contrato + passageiros)
   ↓
Repository (save)
   ↓
Database
```

## Aprovação de contrato

```text
PUT /contracts/{id}/approve
   ↓
Service:
   - calcula totalPeople
   - calcula priceTotal
   - gera token
   ↓
Repository (update)
```

## Consulta por token

```text
GET /contracts/token/{token}
   ↓
Service
   ↓
Repository (findByToken)
```

# Regras de Negócio (Core)

## Contagem de pessoas

```text
totalPeople = 1 (cliente) + acompanhantes
```

## Cálculo de preço

```text
priceTotal = priceBase × totalPeople
```

## Ciclo de vida do contrato

```text
PENDING → APPROVED → PAID → CONFIRMED
```

Cada transição é validada na camada de serviço.

# Relacionamentos

## Contract ↔ Passenger

* Um contrato possui vários passageiros
* Um passageiro pertence a um contrato

```text
Contract 1 ──── N Passenger
```

## Contract ↔ Travel

* Um contrato pertence a uma viagem

```text
Travel 1 ──── N Contract
```

# Pontos de Atenção

## Segurança de dados

* Cálculo de valores feito no backend
* Token gerado internamente
* Não confiar em dados do frontend

## Validação de fluxo

O sistema impede estados inválidos:

* Não pagar antes de aprovar
* Não confirmar antes de pagar

# Observabilidade

Logs importantes:

* Inicialização do servidor
* Queries Hibernate
* Erros de validação

# Evolução da Arquitetura

Possíveis melhorias:

## Modularização

* Separar em módulos (travel, contract, payment)

## Segurança

* JWT Authentication
* Roles (ADMIN / CLIENT)

## Pagamentos

* Integração com gateway (PIX / cartão)

## DTO Layer

* Evitar exposição direta de entidades

## Cloud

* Deploy em AWS (EC2 / RDS)

# Conclusão

A arquitetura atual é:

* ✔ Simples
* ✔ Organizada
* ✔ Escalável
* ✔ Pronta para evolução

Ela fornece uma base sólida para crescimento e integração com frontend e serviços externos 🚀
