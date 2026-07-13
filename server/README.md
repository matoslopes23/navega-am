# Navega API

Backend do ecossistema **Navega AM**, responsável por autenticação, consulta de
viagens, acompanhamento colaborativo de embarcações, telemetria GPS, relatos,
notificações e operações administrativas.

A aplicação utiliza NestJS, PostgreSQL, Prisma e Redis. A primeira versão não
inclui compra ou reserva de passagens: o foco é localizar viagens e acompanhar a
embarcação em tempo real.

## Início rápido

Para executar somente a API em desenvolvimento:

```bash
# Na raiz do monorepo
npm install
cp server/.env.example server/.env
docker compose up -d postgres redis
npm --workspace server run prisma:generate
npm --workspace server run prisma:migrate
npm --workspace server run start:dev
```

Com o valor padrão `PORT=3000`, acesse:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs-json`

Se definir `PORT=3003`, os endereços passam a usar a porta `3003`. O Swagger
utiliza automaticamente a mesma origem pela qual foi aberto.

## Pré-requisitos

- Node.js 22 ou uma versão LTS compatível.
- npm com suporte a workspaces.
- PostgreSQL 16 ou acesso a uma instância PostgreSQL.
- Redis 7 ou um serviço compatível, como Upstash.
- Docker e Docker Compose, caso prefira os serviços locais do projeto.

## Estrutura do monorepo

As dependências são instaladas na raiz, pois o projeto usa npm workspaces:

```text
navega-am/
├── mobile/
├── server/       # esta API
├── web/
├── docs/
├── docker-compose.yml
└── package.json
```

Também é possível executar comandos dentro de `server`, mas evite entrar duas
vezes na pasta (`cd server` quando já estiver em `server`).

## Configuração do ambiente

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp server/.env.example server/.env
```

Variáveis principais:

| Variável | Obrigatória | Descrição |
|---|---:|---|
| `NODE_ENV` | Não | `development`, `test` ou `production` |
| `PORT` | Não | Porta HTTP; padrão `3000` |
| `DATABASE_URL` | Sim | Conexão usada pela aplicação/Prisma |
| `DIRECT_URL` | Não | Conexão direta para migrations; usa `DATABASE_URL` por padrão |
| `JWT_SECRET` | Sim | Segredo JWT; mínimo de 32 caracteres em produção |
| `REDIS_HOST` | Sim | Host do Redis |
| `REDIS_PORT` | Não | Porta do Redis; padrão `6379` |
| `REDIS_PASSWORD` | Não | Senha do Redis/Upstash |
| `CORS_ORIGINS` | Não | Origens permitidas, separadas por vírgula |
| `SWAGGER_ENABLED` | Não | Habilita `/docs`; padrão `true` |
| `PASSWORD_RESET_BASE_URL` | Não | Tela do frontend que receberá o token de recuperação |
| `RESEND_API_KEY` | Produção | Chave para envio do e-mail de recuperação |
| `EMAIL_FROM` | Produção | Remetente verificado no Resend |
| `ADMIN_EMAIL` | Seed | E-mail do administrador inicial |
| `ADMIN_PASSWORD` | Seed | Senha do administrador inicial |
| `ADMIN_CPF` | Seed | CPF do administrador inicial |
| `PING_URL` | Não | URL opcional para o job de keep-alive |
| `PING_INTERVAL_MS` | Não | Intervalo mínimo de 5 segundos |

Exemplo local:

```env
NODE_ENV=development
PORT=3003
DATABASE_URL="postgresql://navega:navega@localhost:5432/navega?schema=public"
DIRECT_URL="postgresql://navega:navega@localhost:5432/navega?schema=public"
JWT_SECRET="development-only-change-me"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
CORS_ORIGINS="http://localhost:8080,http://localhost:5173"
SWAGGER_ENABLED=true
PASSWORD_RESET_BASE_URL="http://localhost:5173/reset-password"
```

Nunca versione o arquivo `.env` nem use os segredos de desenvolvimento em
produção.

## Banco de dados e Redis

Para iniciar apenas a infraestrutura local:

```bash
docker compose up -d postgres redis
docker compose ps
```

Para encerrar os containers sem apagar os dados:

```bash
docker compose stop postgres redis
```

O volume do PostgreSQL mantém os dados entre reinicializações. Não use
`docker compose down -v` se precisar preservar o banco.

### Prisma

Depois de configurar o banco:

```bash
# Gera o Prisma Client
npm --workspace server run prisma:generate

# Desenvolvimento: cria/aplica migrations a partir do schema
npm --workspace server run prisma:migrate

# Produção/homologação: aplica apenas migrations existentes
cd server
npx prisma migrate deploy
```

O comando correto para deploy é `prisma migrate deploy`, e não
`prisma deploy`. Para consultar os dados localmente:

```bash
npm --workspace server run prisma:studio
```

### Dados iniciais e administrador

O seed importa as viagens do CSV e cria o administrador quando as três variáveis
`ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_CPF` estiverem preenchidas:

```bash
npm --workspace server run prisma:seed
```

O seed pode ser executado novamente: viagens já existentes são ignoradas e o
papel do usuário configurado é atualizado para `ADMIN`.

## Executando a aplicação

Na raiz do monorepo:

```bash
npm run dev:server
```

Ou dentro de `server`:

```bash
npm run start:dev
```

Outros modos:

```bash
npm run build
npm run start:prod
```

O modo de produção pressupõe que `dist/` já foi gerado. O Dockerfile aplica
`prisma migrate deploy` antes de iniciar a API.

## Swagger e autenticação

O Swagger contém schemas, exemplos, parâmetros, respostas e indicação de acesso.
Para testar uma rota autenticada:

1. Execute `POST /auth/register` ou `POST /auth/login`.
2. Copie o `accessToken` retornado.
3. Clique em **Authorize** no Swagger.
4. Informe somente o token; o Swagger adiciona `Bearer` automaticamente.

Em clientes HTTP, envie:

```http
Authorization: Bearer <accessToken>
```

Os acessos utilizados na tabela abaixo são:

- **Público**: não exige autenticação.
- **JWT**: exige usuário autenticado.
- **ADMIN**: exige JWT com papel `ADMIN`.

## Rotas da API

### Sistema e saúde

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/` | Público | Identifica o serviço |
| `GET` | `/health` | Público | Verifica disponibilidade básica |
| `GET` | `/health/echo` | Público | Testa parâmetros da API |
| `GET` | `/health/metrics` | Público | Métricas de runtime |
| `GET` | `/home` | Público | Dados consolidados da tela inicial |

### Autenticação e recuperação de senha

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `POST` | `/auth/register` | Público | Cadastra usuário e retorna JWT |
| `POST` | `/auth/login` | Público | Autentica por e-mail ou telefone |
| `POST` | `/auth/forgot-password` | Público | Solicita link de recuperação |
| `POST` | `/auth/reset-password` | Público | Redefine senha com token de uso único |

O endpoint de solicitação sempre retorna a mesma mensagem para não revelar se a
conta existe. O token expira em 30 minutos, é armazenado apenas como hash e perde
a validade depois do primeiro uso. Em desenvolvimento, `resetToken` também é
retornado para facilitar testes; isso não ocorre em produção.

### Perfil e privacidade

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/users/me` | JWT | Consulta o perfil |
| `PATCH` | `/users/me` | JWT | Atualiza nome e telefone |
| `DELETE` | `/users/me` | JWT | Exclui a conta |
| `PATCH` | `/users/me/location-consent` | JWT | Concede ou revoga consentimento GPS |
| `GET` | `/users/me/export` | JWT | Exporta dados pessoais e contribuições |
| `POST` | `/users/me/change-password` | JWT | Altera senha informando a senha atual |

O tracking só pode ser iniciado após consentimento explícito de localização.

### Viagens

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/trips/locations` | Público | Lista origens e destinos disponíveis |
| `GET` | `/trips/search` | Público | Busca viagens com filtros e paginação |
| `GET` | `/trips/active` | Público | Lista viagens em trânsito/LIVE |
| `GET` | `/trips/:id` | Público | Detalhes, itinerário e tracking |
| `POST` | `/trips` | ADMIN | Cadastra uma viagem |
| `PATCH` | `/trips/:id/contribution` | JWT | Informa horário observado pelo usuário |
| `PATCH` | `/trips/:id/status` | ADMIN | Executa transição operacional de status |
| `GET` | `/trips/:id/location-history` | Público | Histórico com precisão reduzida |
| `GET` | `/trips/:id/timeline` | Público | Timeline operacional da viagem |

### Tracking colaborativo

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `POST` | `/trips/:tripId/tracking/start` | JWT | Inicia colaboração na viagem |
| `POST` | `/trips/:tripId/tracking/heartbeat` | JWT | Mantém a sessão ativa |
| `POST` | `/trips/:tripId/tracking/stop` | JWT | Encerra colaboração |
| `GET` | `/trips/:tripId/tracking/status` | JWT | Retorna LIVE, confiança e colaboradores |
| `POST` | `/tracking/sync` | JWT | Sincroniza lote de até 100 pontos GPS |
| `GET` | `/tracking/metrics` | ADMIN | Métricas operacionais do tracking |

Uma posição é considerada LIVE quando foi calculada nos últimos dois minutos. O
aplicativo deve enviar heartbeat durante o compartilhamento. Pontos capturados
offline podem ser sincronizados posteriormente preservando `pingedAt`.

### Relatos colaborativos

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `POST` | `/trips/:tripId/reports` | JWT | Relata atraso, parada ou problema |
| `POST` | `/trips/:tripId/reports/manual-position` | JWT | Envia posição manual para moderação |
| `GET` | `/trips/:tripId/reports/summary` | JWT | Resumo recente dos relatos |
| `PATCH` | `/trips/:tripId/reports/:reportId/moderate` | ADMIN | Confirma ou rejeita relato |

### Notificações

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `POST` | `/users/me/devices` | JWT | Registra token Expo, FCM ou APNs |
| `POST` | `/trips/:tripId/subscriptions` | JWT | Ativa alertas da viagem |
| `DELETE` | `/trips/:tripId/subscriptions` | JWT | Desativa alertas da viagem |
| `GET` | `/users/me/subscriptions` | JWT | Lista viagens acompanhadas |
| `GET` | `/users/me/notifications` | JWT | Lista notificações paginadas |
| `PATCH` | `/users/me/notifications/:id/read` | JWT | Marca notificação como lida |

### Administração e operação

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/operations/ports` | ADMIN | Lista portos e áreas de geofencing |
| `POST` | `/operations/ports` | ADMIN | Cadastra porto |
| `GET` | `/operations/routes` | ADMIN | Lista rotas fluviais GeoJSON |
| `POST` | `/operations/routes` | ADMIN | Cadastra rota fluvial |
| `PATCH` | `/operations/trips/:tripId/route` | ADMIN | Associa rota a uma viagem |
| `GET` | `/admin/users` | ADMIN | Lista usuários |
| `PATCH` | `/admin/users/:id/role` | ADMIN | Altera papel e registra auditoria |
| `GET` | `/admin/audit-logs` | ADMIN | Lista registros de auditoria |

## WebSocket

O Socket.IO utiliza o namespace `/trips`. Envie o JWT no handshake:

```ts
io('http://localhost:3003/trips', {
  auth: { token: accessToken },
});
```

Eventos principais:

- `join_trip`: entra na sala de uma viagem.
- `leave_trip`: sai da sala.
- `boat_position_updated`: recebe a nova posição consolidada.

O contrato completo está em [`../docs/WEBSOCKET.md`](../docs/WEBSOCKET.md).

## Scripts disponíveis

Execute dentro de `server` ou adapte com `npm --workspace server run ...`:

| Script | Uso |
|---|---|
| `npm run start:dev` | Desenvolvimento com watch |
| `npm run build` | Compila para `dist/` |
| `npm run start:prod` | Executa o build |
| `npm run lint` | Corrige/verifica lint |
| `npm run test` | Testes unitários |
| `npm run test:watch` | Testes em watch |
| `npm run test:cov` | Cobertura |
| `npm run test:e2e` | Testes end-to-end |
| `npm run prisma:generate` | Gera Prisma Client |
| `npm run prisma:migrate` | Cria/aplica migration de desenvolvimento |
| `npm run prisma:seed` | Importa dados e cria admin opcional |
| `npm run prisma:studio` | Abre Prisma Studio |

Validação completa recomendada antes de enviar alterações:

```bash
npx eslint "{src,test}/**/*.ts"
npx tsc --noEmit
npm run build
npm test -- --runInBand
```

## Arquitetura

O fluxo esperado é:

```text
Controller → Use case → Repository port → Prisma repository
```

- Controllers tratam HTTP, guards e DTOs.
- Casos de uso concentram regras e orquestração.
- Ports definem os contratos da aplicação.
- Repositories Prisma ficam na infraestrutura.
- DTOs são arquivos próprios em `presentation/dto`.

Consulte [`../docs/BACKEND_ARCHITECTURE.md`](../docs/BACKEND_ARCHITECTURE.md)
antes de criar novos módulos.

## Solução de problemas

### Swagger aberto em uma porta e chamando outra

Abra `/docs` na mesma origem da API e reinicie o servidor após alterar `PORT`.
Sem um `server` fixo no OpenAPI, o Swagger utiliza a origem atual.

### `UnknownDependenciesException`

Confirme se o provider está em `providers`, se o módulo o exporta e se o módulo
consumidor importa o módulo que fornece o token.

### `P1001: Can't reach database server`

Verifique `DATABASE_URL`, host, porta, rede e se o PostgreSQL está ativo. Em
Supabase, confirme também projeto, usuário, senha e modo correto do pooler.

### `tenant/user ... not found`

As credenciais ou o identificador do projeto Supabase estão incorretos ou
desatualizados. Copie novamente as connection strings do painel do projeto.

### Redis `EAI_AGAIN`, `ECONNREFUSED` ou timeout

Verifique `REDIS_HOST`, `REDIS_PORT`, senha e conectividade. Para desenvolvimento
local, execute `docker compose up -d redis` e use `REDIS_HOST=localhost`.

### `@prisma/cli-deploy` retorna 404

Foi executado `prisma deploy`, que não é o comando de migrations. Use:

```bash
npx prisma migrate deploy
```

### O Prisma Client não reconhece um model novo

Execute `npm run prisma:generate` e reinicie o TypeScript Server do editor.

## Documentação complementar

- [`../docs/README.md`](../docs/README.md): índice geral.
- [`../docs/FRONTEND_INTEGRATION.md`](../docs/FRONTEND_INTEGRATION.md): fluxo do frontend.
- [`../docs/API_REFERENCE.md`](../docs/API_REFERENCE.md): referência resumida.
- [`../docs/TRACKING.md`](../docs/TRACKING.md): tracking e funcionamento offline.
- [`../docs/WEBSOCKET.md`](../docs/WEBSOCKET.md): eventos em tempo real.
- [`../docs/BUSINESS_RULES.md`](../docs/BUSINESS_RULES.md): estados e regras.
- [`../docs/AUTH_AND_ERRORS.md`](../docs/AUTH_AND_ERRORS.md): JWT, recuperação e erros.
