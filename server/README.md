# Navega API (Server)

Backend do projeto **Navega AM**, construído em **NestJS** com **Clean Architecture** e **CQRS**.

## ✅ Requisitos

- Node.js (LTS recomendado)
- npm

## ⚙️ Instalação

```bash
npm install
```

> Se estiver usando o monorepo, rode o `npm install` na raiz.

## ▶️ Como rodar

```bash
npm run start:dev
```

Servidor padrão: `http://localhost:3000`

## 📚 Documentação

- Swagger: `http://localhost:3000/docs`
- Arquitetura e padrões: `docs/ARCHITECTURE.md`

## 🔐 Autenticação

Endpoints principais:

- `POST /auth/register`
- `POST /auth/login`

## �️ Banco de dados (Postgres + Prisma)

Este backend usa **Prisma** como ORM e **PostgreSQL**.

### Subir o Postgres (Docker)

Na raiz do monorepo:

```bash
docker compose up -d
```

### Variáveis de ambiente

Configure o `DATABASE_URL` (veja `.env.example`):

```
DATABASE_URL="postgresql://navega:navega@localhost:5432/navega?schema=public"
```

### Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## �🔧 Scripts úteis

```bash
npm run start      # modo normal
npm run start:dev  # desenvolvimento
npm run start:prod # produção
npm run lint       # lint
npm run test       # testes unitários
npm run test:e2e   # testes e2e
npm run build      # build
```

## 🧱 Estrutura (resumo)

```
src/
  modules/
    <feature>/
      domain/
      application/
      infrastructure/
      presentation/
  shared/
```

## 🧩 Como criar um novo módulo

1. Crie `src/modules/<feature>/` com as pastas de camadas.
2. Defina entidades e contratos no `domain`.
3. Crie os **use cases** em `application/use-cases`.
4. Separe **queries/commands** (CQRS).
5. Implemente repositórios em `infrastructure`.
6. Exponha endpoints em `presentation`.
7. Registre providers no `<feature>.module.ts`.
8. Importe o módulo no `AppModule`.

> Veja o exemplo completo em `src/modules/health`.

## ✅ Boas práticas aplicadas

- Clean Architecture (camadas isoladas)
- CQRS (commands/queries)
- Repository + Mapper
- DTO validation (ValidationPipe)
- Logger estruturado (pino)
- ConfigModule com validação de env
- Swagger em `/docs`
