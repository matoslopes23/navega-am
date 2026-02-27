# Arquitetura e padrões (Server)

Este documento explica a arquitetura do backend (`server/`), os padrões aplicados e o passo a passo para criar novos módulos.

## ✅ Visão geral

O backend usa **NestJS** com **Clean Architecture** e **CQRS**. O código é organizado por módulos (ex.: `health`) e cada módulo possui camadas claras de responsabilidade.

```
server/src/
  modules/
    <feature>/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
    config/
    contracts/
    domain/
    errors/
    filters/
    logging/
    mappers/
    utils/
```

## 🧱 Camadas (Clean Architecture)

### 1) **Domain**
Contém regras de negócio puras e conceitos centrais.

- Entidades (`BaseEntity`)
- Value Objects (`ValueObject`)
- Domain Events (`DomainEvent`)

### 2) **Application**
Orquestra o domínio. Implementa casos de uso e contratos.

- Use Cases (`UseCase`)
- Ports (interfaces de repositórios)
- Commands/Queries (CQRS)
- Mappers

### 3) **Infrastructure**
Implementações técnicas e adaptadores externos.

- Repositórios (banco, memória, APIs externas)
- Clients e gateways

### 4) **Presentation**
Camada de entrada (HTTP).

- Controllers
- DTOs com validação

## ✅ Padrões utilizados

### **CQRS (Command/Query Responsibility Segregation)**
- Leitura e escrita separadas
- Commands: ações que modificam estado
- Queries: leitura de dados

### **Repository Pattern**
- Isola a persistência do domínio
- Permite trocar banco ou fonte sem refatorar regras

### **Mapper Pattern**
- Converte entre entidades de domínio e DTOs

### **Use Case por ação**
- Cada regra de negócio fica explícita e testável

### **Result Pattern + AppError**
- Padroniza retorno de sucesso/erro
- Facilita tratamento consistente

### **DTO + ValidationPipe**
- Validação no input da API
- Protege a camada de domínio

### **ConfigModule + env validation**
- Valida variáveis de ambiente na inicialização

### **Logger + Request ID**
- Logs estruturados (pino)
- `x-request-id` para rastrear requisições

### **Exception Filter global**
- Resposta de erro padronizada
- Evita vazamento de stack trace

### **Swagger**
- Documentação automática em `/docs`

## 🧩 Como criar um novo módulo

### 1) Criar pasta do módulo

```
server/src/modules/<feature>/
  domain/
  application/
    commands/
    queries/
    ports/
    use-cases/
    mappers/
  infrastructure/
    repositories/
  presentation/
    dto/
  <feature>.module.ts
```

### 2) Definir domínio

- Entidades
- Value Objects
- Events (se necessário)

### 3) Criar ports (interfaces)

Exemplo: `application/ports/<feature>.repository.ts`

### 4) Implementar casos de uso

- `use-cases/`
- Um arquivo por ação

### 5) CQRS (Commands/Queries)

- Commands e CommandHandlers para escrita
- Queries e QueryHandlers para leitura

### 6) Infraestrutura

- Implementar repositórios reais
- Ex.: `infrastructure/repositories/<feature>.repository.ts`

### 7) Presentation

- Criar Controller
- DTOs com `class-validator`

### 8) Registrar no module

Adicionar controllers e providers no `<feature>.module.ts`.

### 9) Importar no `AppModule`

Registrar o módulo no `app.module.ts`.

## ✅ Boas práticas

- **Nunca** importar infra no domínio
- **Controllers** não devem conter regra de negócio
- Use **DTO** para input e **Mapper** para output
- **UseCase** deve ser pequeno e focado
- Preferir testes unitários por use case

## 🔍 Exemplo (Health)

O módulo `health` é um exemplo completo de:
- CQRS
- DTO validation
- Mapper + repository
- métricas e endpoints

Consulte:
`server/src/modules/health/`
