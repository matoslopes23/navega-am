# Autenticação e erros

## Recuperação de senha

1. Envie `{ "email": "usuario@email.com" }` para `POST /auth/forgot-password`.
2. A API sempre responde com a mesma mensagem, exista ou não uma conta.
3. Para contas existentes, é criado um token válido por 30 minutos; somente o
   SHA-256 do token fica no banco.
4. A tela recebe o token pelo link e envia `{ "token", "password" }` para
   `POST /auth/reset-password`.
5. O token perde a validade após o primeiro uso.

Em desenvolvimento, o token também é retornado em `resetToken` e registrado no
log. Isso não ocorre em teste ou produção.

```env
PASSWORD_RESET_BASE_URL=https://app.exemplo.com/reset-password
RESEND_API_KEY=re_...
EMAIL_FROM=Navega AM <nao-responda@dominio-verificado.com>
```

Sem as credenciais de e-mail, nenhum link é enviado.

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
