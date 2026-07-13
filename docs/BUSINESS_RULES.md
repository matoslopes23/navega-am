# Estados e regras de negócio

## Estados da viagem

```text
programado → no-porto → embarcando → em-transito → concluido
     │           │           │              │
     ├→ atrasado ├───────────┴→ cancelado    └→ no-porto
     └→ cancelado
```

Estados terminais: `concluido` e `cancelado`.

O primeiro lote GPS válido promove automaticamente uma viagem elegível para
`em-transito`. Alterações administrativas usam `PATCH /trips/:id/status`.

## Tracking

- só inicia em viagem `em-transito`;
- exige JWT e consentimento;
- sessão expira após dois minutos sem heartbeat;
- viagem sem posição recente deixa de ser LIVE;
- posição manual exige moderação;
- relatos confirmados permanecem na timeline;
- cálculo de ETA depende de destino e velocidade válida.

## Permissões

| Papel | Pode fazer |
|---|---|
| Público | buscar, ver detalhes, histórico reduzido e timeline |
| `USER` | colaborar, relatar, assinar alertas e gerenciar o próprio perfil |
| `ADMIN` | criar/operar viagens, rotas, portos, moderar e administrar usuários |

