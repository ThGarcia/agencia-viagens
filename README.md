# Sistema de Agência de Viagens

Sistema para gestão de viagens, contratos e lista de embarque.

## Stack

- Frontend: React + TypeScript
- Backend: Java + Spring Boot
- Banco: PostgreSQL

## Arquitetura

Frontend → API → Banco de Dados

## Estrutura do Projeto

```
frontend/ # aplicação React
backend/ # API Spring Boot
docs/ # documentação
```

## Funcionalidades

- **Gestão de Viagens**: Cadastro de destinos e datas das viagens
- **Contratos**: Geração automática de contratos personalizados
- **Lista de Embarque**: Check-list digital para o dia da viagem

## Como rodar localmente

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend 
npm install
npm run dev
```


## Variáveis de ambiente

Crie um arquivo `.env` baseado no exemplo

Para configurar o sistema, crie um arquivo `.env` na raiz das pastas `backend` e `frontend` baseando-se nos arquivos de exemplo:

```bash
# No diretório backend e frontend
cp .env.example .env
```
---

# Status do projeto

Em desenvolvimento
