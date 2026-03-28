# Exemplo de Backlog

Este arquivo e apenas um exemplo didatico.

A fonte de verdade operacional e `backlog.md` na raiz.

## Exemplo

```md
# Backlog - Foodtrucks

## FT-001 - Inicializar monorepo

- Skill: deployment-infra
- Status: READY
- Fluxo critico: nao
- Descricao: Criar monorepo com apps/mobile, apps/admin, apps/api e packages compartilhados
- Dependencias: nenhuma
- Criterios de aceite:
  - turbo configurado
  - pnpm-workspace configurado
  - apps criados
  - scripts base funcionando

## FT-002 - Configurar backend Nest + Prisma

- Skill: nest-api-architecture
- Status: BLOCKED
- Fluxo critico: sim
- Descricao: Inicializar backend e Prisma com PostgreSQL
- Dependencias: FT-001
- Criterios de aceite:
  - Nest inicializado
  - Prisma configurado
  - healthcheck funcionando
```
