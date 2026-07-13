# Referência resumida da API

O contrato detalhado, exemplos e schemas ficam no Swagger `/docs`.

| Método | Rota | Acesso | Uso |
|---|---|---|---|
| POST | `/auth/register` | Público | Cadastro e JWT |
| POST | `/auth/login` | Público | Login e JWT |
| POST | `/auth/forgot-password` | Público | Solicita link de recuperação |
| POST | `/auth/reset-password` | Público | Redefine senha com token de uso único |
| GET/PATCH/DELETE | `/users/me` | JWT | Perfil e exclusão |
| PATCH | `/users/me/location-consent` | JWT | Consentimento GPS |
| GET | `/users/me/export` | JWT | Exportação LGPD |
| POST | `/users/me/change-password` | JWT | Alteração de senha |
| GET | `/home` | Público | Resumo da home |
| GET | `/trips/locations` | Público | Origens e destinos |
| GET | `/trips/search` | Público | Busca paginada |
| GET | `/trips/active` | Público | Viagens em trânsito/LIVE |
| GET | `/trips/:id` | Público | Detalhes e tracking |
| GET | `/trips/:id/location-history` | Público | Histórico reduzido |
| GET | `/trips/:id/timeline` | Público | Eventos operacionais |
| POST | `/trips` | ADMIN | Cadastro de viagem |
| PATCH | `/trips/:id/status` | ADMIN | Transição de status |
| PATCH | `/trips/:id/contribution` | JWT | Horário comunitário |
| POST | `/trips/:id/tracking/start` | JWT | Inicia colaboração |
| POST | `/trips/:id/tracking/heartbeat` | JWT | Mantém colaboração |
| POST | `/trips/:id/tracking/stop` | JWT | Encerra colaboração |
| GET | `/trips/:id/tracking/status` | JWT | LIVE e confiança |
| POST | `/tracking/sync` | JWT | Enfileira lote GPS |
| POST | `/trips/:id/reports` | JWT | Relato de situação |
| POST | `/trips/:id/reports/manual-position` | JWT | Posição moderada |
| GET | `/trips/:id/reports/summary` | JWT | Resumo de relatos |
| PATCH | `/trips/:id/reports/:reportId/moderate` | ADMIN | Moderação |
| POST/DELETE | `/trips/:id/subscriptions` | JWT | Alertas da viagem |
| GET | `/users/me/subscriptions` | JWT | Inscrições ativas |
| GET | `/users/me/notifications` | JWT | Caixa de alertas |
| POST | `/users/me/devices` | JWT | Token Expo/FCM |
| GET/POST | `/operations/ports` | ADMIN | Portos/geofencing |
| GET/POST | `/operations/routes` | ADMIN | Rotas GeoJSON |
| PATCH | `/operations/trips/:id/route` | ADMIN | Associação de rota |
| GET | `/admin/users` | ADMIN | Usuários |
| PATCH | `/admin/users/:id/role` | ADMIN | Papel do usuário |
| GET | `/admin/audit-logs` | ADMIN | Auditoria |
| GET | `/tracking/metrics` | ADMIN | Métricas operacionais |
| GET | `/health` | Público | Disponibilidade |
