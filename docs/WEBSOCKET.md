# WebSocket / Socket.IO

## Conexão

- Namespace: `/trips`
- Transporte: Socket.IO
- Autenticação: `auth.token` ou header `Authorization: Bearer ...`

```ts
const socket = io(`${API_URL}/trips`, {
  auth: { token: accessToken },
});
```

## Cliente → servidor

### `join_trip`

```json
{ "tripId": "uuid" }
```

Resposta do acknowledgement:

```json
{
  "status": "success",
  "message": "Conectado à viagem ...",
  "lastLocation": null
}
```

`lastLocation` inclui posição, confiança, colaboradores, velocidade, progresso,
distância, ETA e `live` quando existir.

### `leave_trip`

```json
{ "tripId": "uuid" }
```

## Servidor → cliente

### `boat_position_updated`

Emitido após o worker agregar um lote GPS:

```json
{
  "tripId": "uuid",
  "latitude": -3.119,
  "longitude": -60.021,
  "confidenceLevel": "MEDIO",
  "contributorCount": 5,
  "speedKmh": 23.1,
  "progressPercent": 62,
  "remainingDistanceKm": 135,
  "estimatedArrival": "2026-07-13T16:30:00.000Z",
  "calculatedAt": "2026-07-13T14:00:00.000Z"
}
```

Ao reconectar, emita `join_trip` novamente e use `lastLocation` para preencher o
intervalo perdido. WebSocket não substitui a sincronização HTTP do GPS.

