# Arquitetura do backend

O backend segue módulos orientados a domínio e separação entre apresentação,
aplicação, domínio e infraestrutura.

```text
HTTP controller → application use case → repository port → Prisma repository
```

## Responsabilidades

- `presentation/controllers`: protocolo HTTP, guards, parâmetros e status codes.
- `presentation/dto`: validação e documentação dos contratos HTTP.
- `application/use-cases`: regras e orquestração de cada operação.
- `application/ports`: interfaces necessárias para persistência e integrações.
- `domain`: entidades e regras sem dependência de NestJS, Prisma ou HTTP.
- `infrastructure/repositories`: implementação dos ports com Prisma.

## Regras para novas funcionalidades

1. Controllers não importam `PrismaService` ou tipos do Prisma.
2. DTOs não são declarados dentro de controllers.
3. Casos de uso dependem de ports, injetados por tokens do módulo.
4. Somente a infraestrutura conhece o Prisma.
5. Operações que precisam ser atômicas são implementadas com transação no
   repository; por exemplo, alteração de papel e criação da auditoria.
6. Controllers pertencem ao módulo do domínio que representam. Controllers de
   perfil e administração de usuários ficam no `UsersModule`, não no `AuthModule`.

## Exemplo de organização

```text
modules/users/
├── application/
│   ├── ports/
│   └── use-cases/
├── domain/
├── infrastructure/
│   └── repositories/
└── presentation/
    ├── dto/
    └── *.controller.ts
```
