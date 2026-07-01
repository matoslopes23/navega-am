# Stage 1: Build
FROM node:22-slim AS builder

# Instalar openssl (necessário para o Prisma Client no Debian slim)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Instalar TODAS as dependências (yarn)
RUN yarn install --frozen-lockfile

# Gerar o Prisma Client
RUN npx prisma generate

# Copiar o restante do código e compilar
COPY . .
RUN yarn build

# ---------------------------------------------------
# Stage 2: Production
FROM node:22-slim

# Instalar openssl na imagem final
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

# Copiar package.json e yarn.lock
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN yarn install --production --frozen-lockfile

# Gerar o client localmente para a imagem de produção
RUN npx prisma generate

# Copiar a compilação final do estágio builder
COPY --from=builder /app/dist ./dist

# O Cloud Run repassa a porta desejada pela variável de ambiente $PORT (default 8080)
# Como a sua aplicação faz: app.listen(process.env.PORT ?? 3000), ela respeitará o Cloud Run!
EXPOSE 3000

# Executar as migrações (se houver) e iniciar o app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
