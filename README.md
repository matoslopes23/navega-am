# Navega AM (Monorepo)

Monorepo do projeto **Navega AM**, com app mobile em Expo + React Native e backend em NestJS.

## 📦 Estrutura

```
.
├─ mobile/     # App Expo/React Native (TypeScript)
├─ server/     # API NestJS (TypeScript)
└─ .github/    # Configurações do repositório
```

## ✅ Requisitos

- Node.js (LTS recomendado)
- npm (incluído no Node)
- Expo Go instalado no celular (para rodar o app no dispositivo)

> No iOS com simulador, é necessário macOS.

## 🚀 Começando

Este monorepo usa **npm workspaces**. Você pode instalar tudo de uma vez na raiz ou por pacote.

Instalação recomendada (na raiz):

```bash
npm install
```

Instalação por pacote (opcional):

```bash
cd mobile
npm install

cd ../server
npm install
```

### Scripts úteis na raiz

```bash
npm run dev:mobile     # Expo (mobile)
npm run dev:server     # NestJS (API)
npm run lint           # lint em todos os workspaces
npm run typecheck      # types do mobile
npm run test           # testes do backend
```

## 📱 App Mobile (Expo)

### Rodar no dispositivo

```bash
cd mobile
npm start
```

- Escaneie o QR code no Expo Go.

### Outros scripts

```bash
npm run android   # abre no Android (via Expo)
npm run ios       # abre no iOS (macOS)
npm run web       # abre no navegador
npm run lint      # lint do projeto
npm run typecheck # checagem de tipos
```

### Arquitetura (mobile)

```
mobile/src/
  app/            # composição, providers e navegação
  core/           # configurações e serviços globais
  features/       # módulos de negócio (ex: home)
  shared/         # componentes, tema e utilitários reutilizáveis
```

Para adicionar novas telas, crie em `mobile/src/features/<feature>/` e registre em
`mobile/src/app/navigation/RootNavigator.tsx`.

## 🧠 Backend (NestJS)

### Rodar em desenvolvimento

```bash
cd server
npm run start:dev
```

### Outros scripts

```bash
npm run start      # modo normal
npm run start:prod # modo produção
npm run lint       # lint do projeto
npm run test       # testes unitários
npm run test:e2e   # testes e2e
```

## 🔗 Padrões do repositório

- Monorepo com dois pacotes independentes.
- Cada pacote possui seu próprio `package.json`.
- Execute scripts sempre dentro da pasta correta (`mobile/` ou `server/`).

## 🗺️ Roadmap sugerido

- Conectar telas do app ao backend.
- Definir contratos de API (DTOs) e versionamento.
- Configurar variáveis de ambiente para os dois pacotes.

## 📝 Licença

Este projeto é privado e não possui licença pública definida.
