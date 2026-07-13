# Tracking colaborativo e offline

## Definição de LIVE

Uma posição é `live` quando foi calculada há no máximo dois minutos. `status`
representa o estado operacional; `live` representa recência da telemetria.

## Confiança

| Colaboradores recentes | Confiança |
|---:|---|
| 1–2 | `BAIXO` |
| 3–9 | `MEDIO` |
| 10+ | `ALTO` |

A posição usa a mediana das coordenadas recentes para reduzir outliers.

## Payload GPS

```json
{
  "tripId": "uuid",
  "deviceId": "compatibilidade-apenas",
  "locations": [
    {
      "clientPointId": "uuid",
      "latitude": -3.119028,
      "longitude": -60.021731,
      "pingedAt": "2026-07-13T14:00:00.000Z",
      "accuracy": 12.5,
      "speed": 6.4,
      "heading": 270
    }
  ]
}
```

O servidor substitui `deviceId` pelo `sub` autenticado. Pontos com precisão pior
que 2 km ou velocidade acima de 55 m/s são armazenados como rejeitados.

## Offline

- aceite capturas de até sete dias;
- preserve `pingedAt` original;
- envie em ordem cronológica;
- não reutilize `clientPointId` para pontos diferentes;
- aplique retry exponencial;
- HTTP `202` significa aceito pela fila, não necessariamente já agregado.

## Privacidade

É obrigatório consentimento explícito. Pontos brutos são apagados após 30 dias.
O histórico público reduz as coordenadas para três casas decimais.

