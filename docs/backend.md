# Backend - Agência de Viagens API
```
Backend responsável por gerenciar viagens, contratos e passageiros, garantindo consistência de dados e regras de negócio.
```

# Arquitetura

O projeto segue uma arquitetura em camadas:

```
Controller → Service → Repository → Database
```

## Camadas

* **Controller**

  * Recebe requisições HTTP
  * Valida entrada
  * Retorna respostas

* **Service**

  * Contém regras de negócio
  * Processa dados
  * Orquestra operações

* **Repository**

  * Comunicação com banco (JPA)
  * CRUD automático

* **Model (Entity)**

  * Representação das tabelas no banco


# Fluxo principal do sistema

O sistema funciona como um ciclo de contratação de viagem:

## Etapas

### 1. Criar contrato

* Cliente informa seus dados
* Pode adicionar acompanhantes
* Status inicial: `PENDING`

### 2. Aprovar contrato

* Sistema calcula valor total
* Gera token de acesso único
* Define forma de pagamento (temporário: PIX)

**Fórmula:**

```
priceTotal = priceBase × totalPeople
```


### 3. Pagamento

* Contrato passa para status `PAID`


### 4. Confirmação

* Contrato finalizado com status `CONFIRMED`
* Viagem garantida 🎉

# Regras de negócio

## Contagem de pessoas

* Cliente principal SEMPRE conta como passageiro
* Total de pessoas:

```
totalPeople = 1 + número de acompanhantes
```

## Cálculo de preço

* O valor é calculado no backend (segurança)
* Nunca confiar no valor vindo do frontend

## Token de acesso

* Gerado automaticamente na aprovação
* Usado para consulta pública do contrato

Exemplo:

```
GET /contracts/token/{token}
```

## Status do contrato

Fluxo obrigatório:

```
PENDING → APPROVED → PAID → CONFIRMED
```

# Entidades principais

## Travel (Viagem)

* title
* description
* priceBase
* departureDate
* returnDate
* status


## Contract (Contrato)

* Dados do cliente
* Endereço
* totalPeople
* priceTotal
* status
* tokenAccess


## Passenger (Passageiro)

* name
* cpf
* birthDate
* roomType
* vínculo com contrato


# Tecnologias utilizadas

* Java 21+
* Spring Boot
* Spring Data JPA
* PostgreSQL
* Swagger (OpenAPI)
* Lombok

# Endpoints principais

## Contratos

* `POST /contracts` → Criar contrato
* `GET /contracts` → Listar contratos
* `PUT /contracts/{id}/approve` → Aprovar
* `PUT /contracts/{id}/paid` → Marcar como pago
* `PUT /contracts/{id}/confirm` → Confirmar
* `GET /contracts/token/{token}` → Buscar por token


## Viagens

* `POST /travels` → Criar viagem
* `GET /travels` → Listar viagens
* `GET /travels/{id}` → Buscar por ID

#  Testes

Os testes podem ser realizados via:

* Swagger UI:

  ```
  http://localhost:8080/swagger-ui.html
  ```

* Postman / Insomnia


# Possíveis erros

## Data inválida

Formato correto:

```
YYYY-MM-DD
```

## Contrato não encontrado

* ID ou token inválido

# Melhorias futuras

* Autenticação JWT
* Integração com pagamento (PIX / cartão)
* Geração de PDF do contrato
* Envio de e-mail automático
* Deploy em cloud (AWS)

# Conclusão

Este backend foi projetado para ser:

* Simples
* Seguro
* Escalável
* Com regras de negócio bem definidas

Pronto para integração com frontend e evolução para produção
