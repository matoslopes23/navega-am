# Autenticação e erros

## Cabeçalho

```http
Authorization: Bearer eyJ...
```

## Formato de erro

```json
{
  "statusCode": 400,
  "timestamp": "2026-07-13T14:00:00.000Z",
  "path": "/tracking/sync",
  "message": ["locations must contain no more than 100 elements"]
}
```

`message` pode ser string ou lista de validações.

| HTTP | Significado | Ação no frontend |
|---:|---|---|
| 400 | Payload ou regra inválida | Mostrar mensagem contextual |
| 401 | Token ausente/inválido | Encerrar sessão local |
| 403 | Papel insuficiente | Ocultar ação e informar permissão |
| 404 | Recurso inexistente | Voltar ou exibir estado vazio |
| 409 | Duplicidade | Destacar campo já utilizado |
| 429 | Limite excedido | Retry com espera |
| 500 | Falha interna | Mensagem genérica e opção de tentar novamente |

Todas as requisições recebem ou preservam `x-request-id`. Inclua esse identificador
ao reportar erros para facilitar rastreamento nos logs.

