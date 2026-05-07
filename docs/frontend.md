# Frontend - Agência de Viagens

```
Frontend responsável pela interação com o usuário, permitindo a compra de viagens e gerenciamento de contratos através de um painel administrativo.
```

---

# Arquitetura

O projeto segue uma arquitetura baseada em componentes com separação por responsabilidades:

```
Pages → Components → Services → API (Backend)
```

---

## Camadas

### **Pages**

* Representam telas da aplicação
* Controlam fluxo de navegação
* Orquestram componentes

Exemplos:

* Home
* Listagem de viagens
* Compra de viagem
* Painel admin

---

### **Components**

* Componentes reutilizáveis
* UI desacoplada da lógica
* Facilita manutenção e escalabilidade

Exemplos:

* Formulários
* Botões
* Cards de viagem
* Tabelas

---

### **Services**

* Comunicação com backend (API)
* Centraliza chamadas HTTP (Axios)
* Abstrai endpoints

Exemplo:

```ts
createUser()
getContracts()
approveContract()
```

---

### **Types (Modelos)**

* Tipagem com TypeScript
* Representa contratos da API
* Evita erros em runtime

---

# Fluxo principal do sistema

## 👤 Usuário (Cliente)

### 1. Visualizar viagens

* Lista de viagens disponíveis
* Informações como preço, data e descrição

---

### 2. Comprar viagem

* Preenche dados pessoais
* Adiciona acompanhantes
* Envia requisição para criação de contrato

```
POST /contracts
```

---

### 3. Acompanhar contrato

* Pode consultar pelo token gerado
* Visualiza status da viagem

```
GET /contracts/token/{token}
```

---

## 🛠️ Administrador

### 1. Gerenciar contratos

* Visualiza todos os contratos
* Aprova, marca como pago e confirma

---

### 2. Fluxo administrativo

```
PENDING → APPROVED → PAID → CONFIRMED
```

Cada ação dispara uma chamada para o backend:

```
PUT /contracts/{id}/approve
PUT /contracts/{id}/paid
PUT /contracts/{id}/confirm
```

---

# Regras de Interface

## Validação de dados

* Campos obrigatórios no formulário
* Formato de CPF e datas
* Feedback visual para erros

---

## Estados da aplicação

* Loading durante requisições
* Tratamento de erro (ex: 500, 404)
* Feedback para o usuário

---

## Segurança

* Não confiar em cálculos no frontend
* Backend é responsável por valores finais
* Token tratado como dado sensível

---

# Tecnologias utilizadas

* React
* TypeScript
* Axios
* React Router DOM
* Vite
* CSS / Tailwind (se aplicável)

---

# Estrutura de pastas

Exemplo:

```
src/
 ├── pages/
 ├── components/
 ├── services/
 ├── types/
 ├── routes/
 ├── hooks/
 └── utils/
```

---

# Integração com Backend

A aplicação consome a API do backend:

```
http://localhost:3000
```

### Exemplo de chamada:

```ts
await axios.post('/users', data);
```

---

# Rotas principais

## Cliente

* `/` → Home
* `/travels` → Lista de viagens
* `/buy` → Compra de viagem
* `/contract/:token` → Consulta contrato

---

## Admin

* `/admin` → Dashboard
* `/admin/contracts` → Gerenciar contratos

---

# Testes

Os testes podem ser feitos manualmente via navegador:

```
http://localhost:5173
```

---

# Possíveis erros

## ❌ Erro 500

* Problema no backend
* Verificar logs do servidor

---

## ❌ Erro de conexão

* Backend não está rodando
* URL da API incorreta

---

## ❌ Dados inválidos

* Campos obrigatórios não preenchidos
* Formato incorreto

---

# Melhorias futuras

* Autenticação (Login Admin)
* Controle de permissões
* Integração com pagamento real
* Melhor UX/UI
* Responsividade mobile
* Notificações (toast)
* Dashboard com métricas

---

# Conclusão

Este frontend foi projetado para ser:

* Simples
* Organizado
* Escalável
* Tipado com segurança (TypeScript)

Pronto para consumir a API e evoluir com novas funcionalidades 🚀

---

## (Extra) Arquitetura detalhada

# Architecture - Frontend Agência de Viagens

Este documento descreve a arquitetura do frontend, suas camadas e fluxo de dados.

---

# Visão Geral

A aplicação segue uma arquitetura baseada em componentes com separação clara:

```text
User → Page → Component → Service → API
```

---

# Fluxo de Dados

## Compra de viagem

```text
Form (User Input)
   ↓
Component
   ↓
Service (Axios)
   ↓
Backend API
   ↓
Resposta → UI
```

---

## Atualização de status (Admin)

```text
Button Click
   ↓
Component
   ↓
Service (PUT request)
   ↓
Backend
   ↓
Atualiza UI
```

---

# Boas práticas aplicadas

* Separação de responsabilidades
* Reutilização de componentes
* Tipagem forte com TypeScript
* Centralização de chamadas HTTP
* Tratamento de erros

---

# Evolução da arquitetura

## Possíveis melhorias

### Gerenciamento de estado

* Context API ou Zustand
* Evitar prop drilling

---

### Camada de DTO

* Normalizar dados da API
* Evitar acoplamento direto

---

### Autenticação

* JWT no frontend
* Proteção de rotas

---

### Performance

* Lazy loading de páginas
* Code splitting

---

# Conclusão

A arquitetura atual é:

* ✔ Moderna
* ✔ Escalável
* ✔ Fácil de manter
* ✔ Integrada com backend

Base sólida para crescimento do projeto 🚀
