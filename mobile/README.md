# Navega Mobile

App mobile criado com Expo + React Native (TypeScript).

## Scripts

- `npm start`: inicia o Metro bundler
- `npm run android`: abre no Android
- `npm run ios`: abre no iOS (macOS necessário)
- `npm run web`: abre no navegador
- `npm run lint`: lint do projeto
- `npm run typecheck`: checagem de tipos

## Arquitetura

```
src/
	app/            # composição, providers e navegação
	core/           # configurações e serviços globais
	features/       # módulos de negócio (ex: home)
	shared/         # componentes, tema e utilitários reutilizáveis
```

### Onde criar telas

Crie novas telas dentro de `src/features/<feature>/` e registre no
`src/app/navigation/RootNavigator.tsx`.
