# Foodtrucks Platform

Plataforma de pedidos para foodtrucks em eventos, com app cliente, painel admin e API central.

## Objetivo do MVP

O primeiro corte do projeto prioriza o fluxo critico:

1. cliente escolhe a barraca
2. cliente monta o pedido
3. cliente paga
4. pedido e confirmado
5. barraca recebe e prepara
6. cliente e avisado quando o pedido estiver pronto
7. cliente retira

Escopo detalhado: `docs/product/mvp.md`  
Fluxo oficial do pedido: `docs/flows/order-flow.md`

## Estrutura do monorepo

```txt
apps/
  admin/    painel web da barraca e da plataforma
  api/      backend central em NestJS
  mobile/   app cliente em Expo

packages/
  api-client/  cliente compartilhado para integracao com a API
  config/      configuracoes compartilhadas
  schemas/     schemas e contratos compartilhados
  types/       tipos compartilhados
  utils/       utilitarios compartilhados
```

Documentacao da arquitetura do workspace: `docs/architecture/monorepo.md`

## Stack base

- Node.js `22.x LTS`
- pnpm `10.x`
- Turborepo `2.5.x`
- TypeScript `5.8.x`
- ESLint `10.x`
- Prettier `3.3.0`
- Mobile: Expo SDK `52`
- Admin: Next.js `16.2.x`
- API: NestJS `11.x` + Prisma `7.x` + PostgreSQL `16.13`

Fonte oficial de versoes: `docs/architecture/version-matrix.md`

## Regras operacionais importantes

- `backlog.md` e a fonte canonica de status
- nenhuma task sai de `READY` sem gatilho humano
- sem `version-matrix` nao ha instalacao segura
- sem Swagger e Scalar nao ha contrato confiavel para API
- se a task tocar Prisma, `prisma generate` e obrigatorio antes de `REVIEW` ou `DONE`

## Scripts da raiz

```bash
pnpm dev
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm clean
```

## Estado atual do scaffold

O repositorio ja possui:

- base do monorepo criada
- TypeScript compartilhado configurado
- ESLint e Prettier compartilhados configurados
- documentacao central de produto, auth, pedidos, pagamentos, notificacoes, testes e observabilidade

Implementacoes de app e backend ainda seguem o backlog.
