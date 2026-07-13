# Documentação Navega AM

Este diretório é o ponto de entrada para integração com o ecossistema Navega AM.

## Para o frontend

1. [Guia de integração](FRONTEND_INTEGRATION.md)
2. [Referência dos endpoints](API_REFERENCE.md)
3. [Tracking e funcionamento offline](TRACKING.md)
4. [Eventos WebSocket](WEBSOCKET.md)
5. [Estados e regras de negócio](BUSINESS_RULES.md)
6. [Erros e autenticação](AUTH_AND_ERRORS.md)
7. [Arquitetura do backend](BACKEND_ARCHITECTURE.md)

## Swagger/OpenAPI

Com a API em execução:

- Interface: `http://localhost:3000/docs`
- JSON OpenAPI: `http://localhost:3000/docs-json`

No Swagger, clique em **Authorize** e informe somente o token JWT. A interface
adicionará o prefixo `Bearer` automaticamente.

O Swagger pode ser desativado em produção com `SWAGGER_ENABLED=false`.

## Gerar tipos TypeScript

```bash
npx openapi-typescript http://localhost:3000/docs-json \
  -o src/generated/navega-api.ts
```

Não mantenha cópias manuais dos DTOs se o cliente puder ser gerado pelo OpenAPI.
