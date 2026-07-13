# Guia de integração frontend

## Configuração

```env
VITE_API_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

Em dispositivo físico, `localhost` aponta para o próprio celular. Use o IP da
máquina que executa o backend.

## Autenticação

1. Chame `POST /auth/register` ou `POST /auth/login`.
2. Armazene `accessToken` em armazenamento seguro.
3. Envie `Authorization: Bearer <token>` nos endpoints protegidos.
4. Em `401`, remova a sessão local e direcione o usuário ao login.

O token contém `sub`, `email` e `role`, e expira em sete dias.

## Tela inicial

Carregue em paralelo:

```text
GET /home
GET /trips/locations
GET /trips/active
```

Use `live`, e não apenas `status`, para mostrar o indicador pulsante. Uma viagem
pode estar `em-transito` e temporariamente sem colaboradores.

## Busca

```text
GET /trips/search?origin=Manaus&destination=Maués&date=2026-07-13
```

Ao selecionar uma viagem, abra `GET /trips/:id`. Mostre o botão de acompanhamento
quando `status === "em-transito"` e `tracking.available` ou o usuário puder iniciar
uma nova colaboração.

## Fluxo de acompanhamento

```text
PATCH /users/me/location-consent { "consent": true }
POST  /trips/:id/tracking/start
conectar Socket.IO namespace /trips
emitir join_trip { tripId }
POST  /trips/:id/tracking/heartbeat periodicamente
POST  /tracking/sync com lotes GPS
receber boat_position_updated
POST  /trips/:id/tracking/stop ao encerrar
emitir leave_trip { tripId }
```

Recomendações:

- heartbeat a cada 45–60 segundos;
- lote GPS com no máximo 100 pontos;
- gerar UUID estável para `clientPointId`;
- persistir localmente pontos ainda não confirmados pela API;
- remover o lote local somente após HTTP `202`;
- chamar `stop` quando o usuário desativar o compartilhamento;
- não usar a posição manual como confirmação automática.

## Alertas

```text
POST /users/me/devices
POST /trips/:id/subscriptions
GET  /users/me/notifications
```

O backend mantém uma caixa de notificações mesmo antes da integração Expo/FCM.

## Relatos

Use `POST /trips/:id/reports` para atraso, parada, avaria ou segurança. Posição
manual usa endpoint próprio e fica pendente de moderação.

## Estados de carregamento

Toda tela que usa rede deve tratar:

- carregando;
- vazio;
- erro de validação;
- não autenticado;
- sem permissão;
- offline com cache;
- dado de tracking antigo (`live=false`).

