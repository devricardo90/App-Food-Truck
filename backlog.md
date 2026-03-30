# Backlog - Foodtrucks Platform

## Protocolo Rick V1.0

## Regras do fluxo

- Apenas tasks com status `READY` podem ser executadas.
- Toda task documental estrategica tambem exige commit antes de virar `DONE`.
- Toda task que instalar ou atualizar dependencia deve consultar `docs/architecture/version-matrix.md` antes de prosseguir.
- Nenhuma task da API pode virar `DONE` sem documentacao minima coerente em OpenAPI, Swagger e Scalar quando aplicavel a etapa.
- Toda task deve ter:
  - ID
  - titulo
  - descricao
  - skill dona
  - dependencias
  - status
  - fluxo critico
  - criterio de aceite
- Toda task executada passa por:
  - `IN_PROGRESS`
  - `REVIEW`
  - `DONE`
- Toda entrega precisa ser revisada pelo Agente Senior Orquestrador antes de commit.
- Apos uma task virar `DONE`, o orquestrador deve reavaliar o backlog e destravar novas tasks.
- Nenhuma task pode ser iniciada sem contexto suficiente.
- Nenhuma task pode ser aprovada se quebrar fluxo critico.
- Se a task mexer em pedido, pagamento, notificacao, auth ou banco, a revisao deve ser mais rigida.

## Status possiveis

- `BLOCKED`
- `TODO`
- `READY`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

## Criterio de priorizacao

Quando houver multiplas tasks `READY`, priorizar por:

1. impacto estrutural
2. dependencia para outras tasks
3. risco tecnico
4. valor para o MVP

## Checkpoint atual consolidado

- Fonte canonica de status: `backlog.md`
- Fonte oficial de versoes: `docs/architecture/version-matrix.md`
- Regras operacionais adicionais: `workflow.md`
- Swagger e Scalar entram cedo no backend e nao sao opcionais
- Tasks documentais estrategicas da Fase 1 tambem exigem commit
- O Agente Master humano segue como unico gatilho para iniciar novo ciclo

---

# EPIC 01 - Fundacao do projeto

## FT-001 - Inicializar monorepo base

- **Skill dona:** `deployment-infra`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar a base do monorepo com Turborepo, pnpm workspace, apps e packages compartilhados.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - `turbo.json` criado
  - `pnpm-workspace.yaml` criado
  - apps `mobile`, `admin` e `api` criados
  - packages compartilhados criados
  - scripts base funcionando na raiz
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `package.json`
  - `pnpm-workspace.yaml`
  - `turbo.json`
  - `pnpm-lock.yaml`
  - `apps/*`
  - `packages/*`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - pnpm install: ok
  - lint: ok
  - typecheck: ok
  - test: ok
  - build: ok com warnings esperados de scaffold sem outputs reais
  - clean: ok
  - commit: ok
- **Commit:** `chore(repo): initialize turborepo workspace base`

## FT-002 - Configurar TypeScript compartilhado

- **Skill dona:** `deployment-infra`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar configuracao base de TypeScript para todos os apps e packages.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - `tsconfig` base criado
  - apps herdando config compartilhada
  - packages herdando config compartilhada
  - typecheck basico funcionando
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `tsconfig.base.json`
  - `apps/admin/tsconfig.json`
  - `apps/api/tsconfig.json`
  - `apps/mobile/tsconfig.json`
  - `packages/api-client/tsconfig.json`
  - `packages/config/tsconfig.json`
  - `packages/schemas/tsconfig.json`
  - `packages/types/tsconfig.json`
  - `packages/utils/tsconfig.json`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - typecheck: ok
  - lint: ok no scaffold atual
  - test: ok no scaffold atual
  - build: ok com warnings esperados de outputs ainda nao definidos
  - commit: ok
- **Commit:** `chore(repo): configure shared typescript base`

## FT-003 - Configurar ESLint e Prettier do monorepo

- **Skill dona:** `deployment-infra`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Padronizar lint e formatacao em todos os apps e packages.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - config compartilhada criada
  - scripts de lint funcionando
  - scripts de format/check funcionando
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `eslint.config.mjs`
  - `prettier.config.cjs`
  - `.prettierignore`
  - `package.json`
  - `apps/*/package.json`
  - `packages/*/package.json`
  - `pnpm-lock.yaml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - lint: ok
  - format:check: ok
  - typecheck: ok
  - test: ok no scaffold atual
  - build: ok com warnings esperados de outputs ainda nao definidos
  - commit: ok
- **Commit:** `chore(repo): configure shared eslint and prettier`

## FT-004 - Criar README raiz e documentacao minima

- **Skill dona:** `product-system-design`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Documentar objetivo do projeto, stack, estrutura do monorepo e fluxo MVP inicial.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - `README.md` raiz criado
  - `docs/product/mvp.md` criado
  - `docs/architecture/monorepo.md` criado
  - `docs/flows/order-flow.md` criado
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `README.md`
  - `docs/architecture/monorepo.md`
  - `docs/product/mvp.md`
  - `docs/flows/order-flow.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - format:check: ok
  - lint: ok
  - typecheck: ok
  - commit: ok
- **Commit:** `docs(project): add root readme and monorepo overview`

---

# EPIC 02 - Arquitetura do produto

## FT-005 - Definir escopo oficial do MVP

- **Skill dona:** `product-system-design`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Formalizar o que entra e o que nao entra no MVP do Foodtrucks.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - personas principais definidas
  - modulos MVP definidos
  - fora de escopo definido
  - riscos operacionais anotados
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/product/mvp.md`
- **Observacao:** implementacao concluida, revisada localmente e registrada no repositorio Git.
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(product): define foodtrucks mvp scope`

## FT-006 - Definir jornadas oficiais das 3 personas

- **Skill dona:** `ui-ux-pro-max`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Mapear jornada do cliente, da barraca e da gestao central.
- **Dependencias:** `FT-005`
- **Criterios de aceite:**
  - jornada do cliente documentada
  - jornada da barraca documentada
  - jornada da gestao central documentada
  - pontos de friccao mapeados
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/product/persona-journeys.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(product): define persona journeys for mvp`

## FT-007 - Definir mapa inicial de telas do mobile

- **Skill dona:** `ui-ux-pro-max`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Definir telas do app do cliente no MVP.
- **Dependencias:** `FT-006`
- **Criterios de aceite:**
  - telas essenciais listadas
  - navegacao principal definida
  - estados vazios e de erro previstos
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/product/mobile-screen-map.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(product): define mobile screen map for mvp`

## FT-008 - Definir mapa inicial de telas do admin

- **Skill dona:** `ui-ux-pro-max`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Definir telas do painel da barraca e do painel central.
- **Dependencias:** `FT-006`
- **Criterios de aceite:**
  - telas da barraca listadas
  - telas da gestao central listadas
  - acoes operacionais principais definidas
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/product/admin-screen-map.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(product): define admin screen map for mvp`

---

# EPIC 03 - Backend e dominio

## FT-009 - Inicializar backend NestJS

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar app NestJS com estrutura inicial de modulos e healthcheck.
- **Dependencias:** `FT-001`, `FT-002`
- **Criterios de aceite:**
  - app NestJS criado
  - modulo principal configurado
  - endpoint health funcionando
  - estrutura `modules`, `common`, `config`, `prisma` criada
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/package.json`
  - `apps/api/tsconfig.json`
  - `apps/api/tsconfig.build.json`
  - `apps/api/src/main.ts`
  - `apps/api/src/modules/app.module.ts`
  - `apps/api/src/modules/health/*`
  - `apps/api/src/common/index.ts`
  - `apps/api/src/config/index.ts`
  - `apps/api/src/prisma/index.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - lint: ok
  - typecheck: ok
  - build: ok
  - healthcheck: ok em `GET /health`
  - test: ok no scaffold atual
  - commit: ok
- **Commit:** `feat(api): initialize nest backend base`

## FT-010 - Configurar Prisma + PostgreSQL

- **Skill dona:** `database-design`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Integrar Prisma ao backend e configurar conexao com PostgreSQL.
- **Dependencias:** `FT-009`
- **Criterios de aceite:**
  - Prisma configurado
  - datasource funcionando
  - Prisma Client gerado
  - primeira conexao com banco validada
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/package.json`
  - `apps/api/prisma.config.ts`
  - `apps/api/prisma/schema.prisma`
  - `apps/api/.env.example`
  - `apps/api/src/prisma/prisma.module.ts`
  - `apps/api/src/prisma/prisma.service.ts`
  - `.gitignore`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - prisma validate: ok
  - prisma generate: ok
  - Prisma Client atualizado: ok
  - conexao inicial PostgreSQL 16.13: ok via container temporario
  - migration: nao aplicavel nesta etapa sem schema de dominio
  - lint API: ok
  - typecheck API: ok
  - build API: ok
  - format:check: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok
- **Commit:** `feat(api): configure prisma and postgres baseline`

## FT-011 - Modelar schema inicial do dominio

- **Skill dona:** `database-design`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Criar schema inicial com entidades principais do MVP.
- **Dependencias:** `FT-005`, `FT-010`
- **Criterios de aceite:**
  - entidades principais criadas
  - relacoes definidas
  - enums principais definidos
  - schema revisado para historico e multi-barraca
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/prisma/schema.prisma`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - entidades principais: ok
  - relacoes: ok
  - enums principais: ok
  - historico e multi-barraca: ok
  - prisma validate: ok
  - prisma generate: ok
  - Prisma Client atualizado: ok
  - typecheck API: ok
  - build API: ok
  - format:check: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok
- **Commit:** `feat(db): model initial mvp domain schema`

## FT-012 - Criar migration inicial

- **Skill dona:** `database-design`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Gerar migration inicial do banco.
- **Dependencias:** `FT-011`
- **Criterios de aceite:**
  - migration criada
  - banco sincronizado
  - sem erro de geracao do client
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/prisma/migrations/20260328115642_init/migration.sql`
  - `apps/api/prisma/migrations/migration_lock.toml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - prisma migrate dev: ok
  - prisma migrate status: ok
  - prisma validate: ok
  - prisma generate: ok
  - Prisma Client atualizado: ok
  - banco sincronizado: ok via PostgreSQL 16.13 em container temporario
  - typecheck API: ok
  - build API: ok
  - format:check: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok
- **Commit:** `feat(db): create initial prisma migration`

## FT-013 - Definir modulos do backend

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Definir modulos iniciais do backend e fronteiras entre eles.
- **Dependencias:** `FT-005`, `FT-009`, `FT-011`
- **Criterios de aceite:**
  - modulos listados
  - responsabilidades por modulo definidas
  - dependencias entre modulos anotadas
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/architecture/backend-modules.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - modulos listados: ok
  - responsabilidades por modulo: ok
  - dependencias entre modulos: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(api): define backend module boundaries`

---

# EPIC 04 - Auth e permissoes

## FT-014 - Definir estrategia oficial de autenticacao

- **Skill dona:** `auth-rbac`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Decidir e documentar a estrategia oficial de autenticacao do MVP.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - provider principal definido
  - fluxo mobile definido
  - fluxo web definido
  - integracao com backend prevista
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/auth/auth-strategy.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(auth): define mvp authentication strategy`

## FT-015 - Definir roles e permissoes do sistema

- **Skill dona:** `auth-rbac`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Definir papeis e permissoes minimas por area.
- **Dependencias:** `FT-014`
- **Criterios de aceite:**
  - roles definidas
  - permissoes por role documentadas
  - separacao entre barraca e gestao central garantida
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/auth/roles-permissions.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(auth): define roles and permissions for mvp`

## FT-016 - Integrar auth no backend

- **Skill dona:** `auth-rbac`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Preparar backend para validar identidade e autorizacao.
- **Dependencias:** `FT-009`, `FT-014`, `FT-015`
- **Criterios de aceite:**
  - guard base criado
  - user context resolvido
  - autorizacao por role prevista
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/package.json`
  - `apps/api/.env.example`
  - `apps/api/src/main.ts`
  - `apps/api/src/modules/app.module.ts`
  - `apps/api/src/modules/health/health.controller.ts`
  - `apps/api/src/modules/auth/auth.constants.ts`
  - `apps/api/src/modules/auth/auth.controller.ts`
  - `apps/api/src/modules/auth/auth.guard.ts`
  - `apps/api/src/modules/auth/auth.module.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/api/src/modules/auth/auth.types.ts`
  - `apps/api/src/modules/auth/current-auth-user.decorator.ts`
  - `apps/api/src/modules/auth/public.decorator.ts`
  - `apps/api/src/modules/auth/roles.decorator.ts`
  - `apps/api/src/modules/auth/roles.guard.ts`
  - `apps/admin/next-env.d.ts`
  - `apps/admin/tsconfig.json`
  - `docs/architecture/version-matrix.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - guard base: ok
  - user context: ok
  - autorizacao por role: ok
  - swagger bearer auth: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - runtime auth end-to-end: pendente por indisponibilidade de ambiente local com banco e secrets
  - commit: ok

---

# EPIC 05 - App mobile do cliente

## FT-017 - Inicializar app Expo

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar base do app mobile com Expo.
- **Dependencias:** `FT-001`, `FT-002`
- **Criterios de aceite:**
  - app Expo criado
  - scripts de execucao funcionando
  - estrutura inicial estabelecida
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/mobile/package.json`
  - `apps/mobile/tsconfig.json`
  - `apps/mobile/app.json`
  - `apps/mobile/App.tsx`
  - `apps/mobile/index.ts`
  - `apps/mobile/assets/*`
  - `pnpm-lock.yaml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - Expo SDK 52: ok
  - expo config: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - format:check: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok
- **Commit:** `feat(mobile): initialize expo sdk 52 app base`

## FT-018 - Configurar Expo Router + NativeWind + libs base

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Configurar roteamento, styling e libs de estado, forms e server state.
- **Dependencias:** `FT-017`
- **Criterios de aceite:**
  - Expo Router funcionando
  - NativeWind funcionando
  - Zustand configurado
  - TanStack Query configurado
  - RHF + Zod configurados
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/mobile/package.json`
  - `apps/mobile/app.json`
  - `apps/mobile/tsconfig.json`
  - `apps/mobile/babel.config.js`
  - `apps/mobile/metro.config.js`
  - `apps/mobile/tailwind.config.js`
  - `apps/mobile/global.css`
  - `apps/mobile/expo-env.d.ts`
  - `apps/mobile/nativewind-env.d.ts`
  - `apps/mobile/app/_layout.tsx`
  - `apps/mobile/app/index.tsx`
  - `apps/mobile/src/providers/app-providers.tsx`
  - `apps/mobile/src/lib/query-client.ts`
  - `apps/mobile/src/store/ui-store.ts`
  - `docs/architecture/version-matrix.md`
  - `pnpm-lock.yaml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - expo config: ok
  - Expo Router: ok
  - NativeWind: ok
  - Zustand: ok
  - TanStack Query: ok
  - RHF + Zod: ok
  - Clerk mobile: bloqueado fora desta task por incompatibilidade com Expo SDK 52
  - lint mobile: ok
  - typecheck mobile: ok
  - build mobile: ok no scaffold atual
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok

## FT-019 - Criar estrutura de rotas do app cliente

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar rotas base para auth, trucks, menu, cart e orders.
- **Dependencias:** `FT-018`, `FT-007`
- **Criterios de aceite:**
  - rotas principais criadas
  - layouts base definidos
  - navegacao inicial funcional
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/mobile/app/index.tsx`
  - `apps/mobile/app/(auth)/*`
  - `apps/mobile/app/(app)/*`
  - `apps/mobile/src/mocks/trucks.ts`
  - `apps/mobile/src/mocks/orders.ts`
  - `apps/mobile/src/mocks/cart.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - rotas principais: ok
  - layouts base: ok
  - navegacao inicial: ok
  - auth placeholder: ok
  - fluxo de descoberta: ok
  - fluxo de pedido: ok
  - historico e conta: ok
  - expo config: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - format:check: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok

---

# EPIC 06 - Painel admin web

## FT-020 - Inicializar app admin Next.js

- **Skill dona:** `next-admin-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar base do painel web em Next.js.
- **Dependencias:** `FT-001`, `FT-002`
- **Criterios de aceite:**
  - app Next criado
  - Tailwind configurado
  - estrutura base criada
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/admin/package.json`
  - `apps/admin/tsconfig.json`
  - `apps/admin/next-env.d.ts`
  - `apps/admin/next.config.ts`
  - `apps/admin/postcss.config.mjs`
  - `apps/admin/app/layout.tsx`
  - `apps/admin/app/page.tsx`
  - `apps/admin/app/globals.css`
  - `.gitignore`
  - `.prettierignore`
  - `docs/architecture/version-matrix.md`
  - `pnpm-lock.yaml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - Next 16.2.1: ok
  - React 19.2.4: ok
  - Tailwind 4.2.2: ok
  - app scaffold: ok
  - App Router: ok
  - typecheck admin: ok
  - lint admin: ok
  - build admin: ok
  - format:check: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok

## FT-021 - Configurar UI base do admin

- **Skill dona:** `next-admin-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Configurar componentes e layout base do painel.
- **Dependencias:** `FT-020`, `FT-008`
- **Criterios de aceite:**
  - layout autenticado criado
  - navegacao lateral/topo criada
  - paginas base acessiveis
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/admin/app/page.tsx`
  - `apps/admin/app/login/page.tsx`
  - `apps/admin/app/(console)/layout.tsx`
  - `apps/admin/app/(console)/truck/*`
  - `apps/admin/app/(console)/central/*`
  - `apps/admin/src/components/console-shell.tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - layout autenticado: ok
  - navegacao lateral/topo: ok
  - paginas base acessiveis: ok
  - separacao barraca/central: ok
  - login e redirecionamento base: ok
  - lint admin: ok
  - typecheck admin: ok
  - build admin: ok
  - commit: ok

## FT-022 - Criar estrutura de rotas do admin

- **Skill dona:** `next-admin-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Criar rotas base para dashboard, pedidos, cardapio, relatorios e setup central.
- **Dependencias:** `FT-021`
- **Criterios de aceite:**
  - rotas principais criadas
  - separacao entre area barraca e area central prevista
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/admin/app/page.tsx`
  - `apps/admin/app/login/page.tsx`
  - `apps/admin/app/(console)/layout.tsx`
  - `apps/admin/app/(console)/truck/*`
  - `apps/admin/app/(console)/central/*`
  - `apps/admin/src/components/console-shell.tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - rotas principais: ok
  - separacao barraca/central: ok
  - dashboard barraca: ok
  - dashboard central: ok
  - pedidos/cardapio/configuracoes: ok
  - barracas/acessos/suporte: ok
  - lint admin: ok
  - typecheck admin: ok
  - build admin: ok
  - commit: ok

---

# EPIC 07 - Fluxo critico de pedidos

## FT-023 - Definir maquina de estados do pedido

- **Skill dona:** `order-operations`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Formalizar os estados do pedido e transicoes permitidas.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - estados definidos
  - transicoes validas definidas
  - origem de cada transicao documentada
  - casos de erro anotados
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/flows/order-flow.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(order): define order state machine`

## FT-024 - Definir regra de capacidade por janela de tempo

- **Skill dona:** `order-operations`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Definir throttling por slot de tempo para evitar sobrecarga da barraca.
- **Dependencias:** `FT-023`
- **Criterios de aceite:**
  - regra por janela definida
  - comportamento quando lotado definido
  - impacto no checkout previsto
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/flows/capacity-window-rule.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(order): define capacity window rule for mvp`

## FT-025 - Definir regra de estoque diario

- **Skill dona:** `order-operations`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Definir como o estoque do dia sera controlado no MVP.
- **Dependencias:** `FT-023`
- **Criterios de aceite:**
  - regra de disponibilidade definida
  - impacto em menu e checkout definido
  - fallback manual previsto
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/flows/daily-stock-rule.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(order): define daily stock rule for mvp`

---

# EPIC 08 - Pagamentos e notificacao

## FT-026 - Definir fluxo oficial de pagamento do pedido

- **Skill dona:** `payments-integration`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Formalizar como o pedido nasce, aguarda pagamento e e confirmado.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - estados do pagamento definidos
  - relacao pagamento-pedido definida
  - webhook ou callback previsto
  - regra de idempotencia prevista
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/flows/payment-flow.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(payments): define payment confirmation flow`

## FT-027 - Definir cobranca mensal da plataforma

- **Skill dona:** `payments-integration`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Modelar o fluxo da mensalidade paga pela barraca a plataforma.
- **Dependencias:** `FT-005`
- **Criterios de aceite:**
  - regra de cobranca definida
  - status de assinatura definidos
  - impacto em acesso da barraca previsto
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/flows/platform-billing.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - regra de cobranca: ok
  - status de assinatura: ok
  - impacto em acesso da barraca: ok
  - separacao entre cobranca recorrente e pagamento do pedido: ok
  - commit: ok

## FT-028 - Definir estrategia de push e SMS

- **Skill dona:** `realtime-notifications`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Decidir canais e responsabilidades para confirmacao e aviso de pedido pronto.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - push definido
  - SMS definido ou descartado para MVP
  - fallback previsto
  - eventos que disparam notificacao listados
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/flows/notifications-strategy.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(notifications): define push strategy for mvp`

---

# EPIC 09 - Qualidade e operacao

## FT-029 - Configurar scripts de lint, typecheck e test

- **Skill dona:** `testing-strategy`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Padronizar scripts de qualidade no monorepo.
- **Dependencias:** `FT-001`, `FT-002`, `FT-003`
- **Criterios de aceite:**
  - script de lint funcional
  - script de typecheck funcional
  - script de test funcional
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `package.json`
  - `turbo.json`
  - `apps/admin/package.json`
  - `apps/api/package.json`
  - `apps/mobile/package.json`
  - `packages/api-client/package.json`
  - `packages/config/package.json`
  - `packages/schemas/package.json`
  - `packages/types/package.json`
  - `packages/utils/package.json`
- **Revisao:** `aprovada`
- **Validacoes:**
  - lint raiz: ok
  - typecheck raiz: ok
  - test raiz: ok
  - scripts por workspace: ok
  - orquestracao via turbo: ok
  - commit: ok

## FT-030 - Definir estrategia minima de testes do MVP

- **Skill dona:** `testing-strategy`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Definir quais fluxos criticos devem obrigatoriamente ter cobertura antes de staging.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - fluxos obrigatorios listados
  - niveis de teste definidos
  - criterios minimos de entrada em staging definidos
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/quality/mvp-test-strategy.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(testing): define mvp minimum test strategy`

## FT-031 - Definir estrategia minima de logs e rastreabilidade

- **Skill dona:** `observability-support`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Definir logs minimos para suporte de pedidos, pagamentos e notificacoes.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - eventos criticos listados
  - identificadores de rastreio definidos
  - logs minimos por fluxo definidos
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/quality/logs-traceability-strategy.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(observability): define mvp logs and traceability`

## FT-032 - Definir ambientes e deploy inicial

- **Skill dona:** `deployment-infra`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Definir estrutura de ambientes para desenvolvimento, staging e producao.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - ambientes definidos
  - estrategia de secrets definida
  - deploy inicial planejado

## FT-033 - Definir version-matrix oficial

- **Skill dona:** `deployment-infra`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Definir a matriz oficial de versoes e compatibilidade da stack do projeto.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - arquivo `docs/architecture/version-matrix.md` criado
  - versoes centrais definidas
  - ordem de instalacao definida
  - politica de upgrade registrada
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/architecture/version-matrix.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(infra): define version matrix and protocol rules`

## FT-034 - Configurar Swagger no backend

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Configurar Swagger no backend para expor a documentacao tecnica da API.
- **Dependencias:** `FT-009`
- **Criterios de aceite:**
  - Swagger configurado
  - OpenAPI base gerado
  - rota de documentacao disponivel
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/package.json`
  - `apps/api/src/main.ts`
  - `apps/api/src/modules/health/health.controller.ts`
  - `pnpm-lock.yaml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - lint API: ok
  - typecheck API: ok
  - build API: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - `GET /health`: ok
  - `GET /docs`: ok
  - `GET /docs-json`: ok
  - OpenAPI base: ok com `/health`
  - commit: ok
- **Commit:** `feat(api): configure swagger openapi docs`

## FT-035 - Configurar Scalar no backend

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Configurar Scalar consumindo o documento OpenAPI da API.
- **Dependencias:** `FT-034`
- **Criterios de aceite:**
  - Scalar configurado
  - referencia navegavel disponivel
  - coerencia com o documento OpenAPI
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/package.json`
  - `apps/api/src/main.ts`
  - `pnpm-lock.yaml`
- **Revisao:** `aprovada`
- **Validacoes:**
  - version-matrix: ok
  - compatibilidade: ok
  - ordem de instalacao: ok
  - lint API: ok
  - typecheck API: ok
  - build API: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - `GET /docs-json`: ok
  - `GET /reference`: ok
  - coerencia com OpenAPI do Swagger: ok
  - commit: ok
- **Commit:** `feat(api): configure scalar api reference`

## FT-036 - Definir politica de versoes e upgrades

- **Skill dona:** `deployment-infra`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Formalizar a politica operacional de versoes, upgrades incrementais e instalacao segura.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - politica de upgrade definida
  - regra de instalacao segura documentada
  - regra de alteracao de versao documentada
  - impacto no protocolo registrado
- **Entrega em:** `2026-03-28`
- **Artefato:** `docs/architecture/version-upgrade-policy.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - escopo: ok
  - criterios de aceite: ok
  - build: nao aplicavel
  - testes: nao aplicavel
  - commit: ok
- **Commit:** `docs(infra): define version upgrade policy`

---

# EPIC 10 - Primeira camada funcional autenticada

## FT-037 - Integrar auth no admin web

- **Skill dona:** `next-admin-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Conectar o admin ao provider de auth, proteger rotas e resolver sessao base no painel.
- **Dependencias:** `FT-020`, `FT-021`, `FT-022`, `FT-014`, `FT-015`, `FT-040`, `FT-046`
- **Criterios de aceite:**
  - auth no admin configurada
  - rotas autenticadas protegidas
  - sessao base resolvida no painel
  - regra de acesso por area preparada com contexto de foodtruck
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/admin/app/layout.tsx`
  - `apps/admin/app/login/page.tsx`
  - `apps/admin/app/page.tsx`
  - `apps/admin/app/(console)/layout.tsx`
  - `apps/admin/proxy.ts`
  - `apps/admin/package.json`
  - `docs/architecture/version-matrix.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - auth no admin configurada: ok
  - rotas autenticadas protegidas: ok
  - sessao base resolvida no painel: ok
  - contexto base via `/auth/me`: ok com fallback de erro
  - lint admin: ok
  - typecheck admin: ok
  - build admin: ok
  - commit: pendente

## FT-038 - Integrar auth no app mobile

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Conectar o app cliente ao provider de auth, proteger entrada do app e resolver sessao base no mobile.
- **Dependencias:** `FT-017`, `FT-018`, `FT-019`, `FT-014`, `FT-040`, `FT-046`
- **Criterios de aceite:**
  - auth no mobile configurada
  - fluxo de entrada autenticada preparado
  - sessao base resolvida no app
  - rotas publicas e autenticadas separadas
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `.npmrc`
  - `apps/mobile/app.json`
  - `apps/mobile/app/_layout.tsx`
  - `apps/mobile/app/(auth)/_layout.tsx`
  - `apps/mobile/app/(auth)/sign-in.tsx`
  - `apps/mobile/app/(app)/_layout.tsx`
  - `apps/mobile/app/(app)/(tabs)/account.tsx`
  - `apps/mobile/src/providers/app-providers.tsx`
  - `apps/mobile/src/lib/auth-api.ts`
  - `apps/mobile/package.json`
  - `docs/architecture/version-matrix.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - auth no mobile configurada: ok
  - fluxo de entrada autenticada preparado: ok
  - sessao base resolvida no app: ok
  - rotas publicas e autenticadas separadas: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - auth preservada apos ajuste de Metro/pnpm: ok
  - commit: pendente

## FT-039 - Implementar modulo de users e memberships do foodtruck no backend

- **Skill dona:** `auth-rbac`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Implementar modulos de usuarios e memberships de foodtruck para sustentar contexto operacional real.
- **Dependencias:** `FT-011`, `FT-013`, `FT-015`, `FT-016`
- **Criterios de aceite:**
  - modulo de users criado
  - modulo de memberships criado
  - servicos base de leitura implementados
  - fronteira com auth e foodtrucks prevista
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/users/users.module.ts`
  - `apps/api/src/modules/users/users.service.ts`
  - `apps/api/src/modules/users/users.types.ts`
  - `apps/api/src/modules/foodtruck-memberships/foodtruck-memberships.module.ts`
  - `apps/api/src/modules/foodtruck-memberships/foodtruck-memberships.service.ts`
  - `apps/api/src/modules/foodtruck-memberships/foodtruck-memberships.types.ts`
  - `apps/api/src/modules/auth/auth.module.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/api/src/modules/auth/auth.types.ts`
  - `apps/api/src/modules/app.module.ts`
  - `.prettierignore`
- **Revisao:** `aprovada`
- **Validacoes:**
  - modulo de users: ok
  - modulo de memberships: ok
  - servicos base de leitura: ok
  - fronteira com auth e foodtrucks: ok
  - lint API: ok
  - typecheck API: ok
  - build API: ok
  - formatacao raiz: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - commit: ok

## FT-040 - Expor contexto autenticado estavel do foodtruck na API

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Consolidar endpoints e contratos estaveis de contexto autenticado de foodtruck para consumo do admin e do mobile.
- **Dependencias:** `FT-016`, `FT-039`, `FT-034`, `FT-035`
- **Criterios de aceite:**
  - `/auth/me` estavel
  - contexto de foodtruck resolvido
  - contexto de plataforma resolvido
  - contratos documentados em OpenAPI
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/auth/auth.controller.ts`
  - `apps/api/src/modules/auth/auth.dto.ts`
  - `apps/api/src/modules/auth/auth.module.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/api/src/modules/auth/auth.types.ts`
  - `apps/api/src/modules/auth/current-active-foodtruck.decorator.ts`
  - `apps/api/src/modules/auth/foodtruck-membership.decorator.ts`
  - `apps/api/src/modules/auth/foodtruck-membership.guard.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - `/auth/me` estavel: ok
  - contexto de foodtruck resolvido: ok
  - contexto de plataforma resolvido: ok
  - contratos OpenAPI anotados: ok
  - lint API: ok
  - typecheck API: ok
  - build API: ok
  - formatacao raiz: ok
  - lint raiz: ok
  - typecheck raiz: ok
  - build raiz: ok
  - validacao runtime local dos endpoints: pendente por ausencia de `.env` local da API
  - commit: ok

## FT-041 - Integrar admin com contexto autenticado de foodtruck da API

- **Skill dona:** `next-admin-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Conectar o admin autenticado ao contexto real do backend e preparar guardas por area e foodtruck.
- **Dependencias:** `FT-037`, `FT-040`
- **Criterios de aceite:**
  - admin consome `/auth/me`
  - area do foodtruck usa contexto real
  - area central usa contexto real
  - fallback de sessao invalida previsto
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/admin/src/lib/auth-context.ts`
  - `apps/admin/app/(console)/layout.tsx`
  - `apps/admin/app/(console)/truck/layout.tsx`
  - `apps/admin/app/(console)/central/layout.tsx`
  - `apps/admin/app/(console)/truck/page.tsx`
  - `apps/admin/app/(console)/central/page.tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - admin consome `/auth/me`: ok
  - area do foodtruck usa contexto real: ok
  - area central usa contexto real: ok
  - fallback de sessao invalida previsto: ok
  - lint admin: ok
  - typecheck admin: ok
  - build admin: ok
  - commit: pendente

## FT-042 - Integrar mobile com contexto autenticado de foodtruck da API

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Conectar o app autenticado ao contexto real do backend e preparar bootstrap de sessao do cliente.
- **Dependencias:** `FT-038`, `FT-040`
- **Criterios de aceite:**
  - mobile consome `/auth/me`
  - bootstrap de sessao implementado
  - rotas autenticadas usam contexto real
  - fallback de token invalido previsto
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/mobile/src/lib/auth-api.ts`
  - `apps/mobile/src/providers/app-providers.tsx`
  - `apps/mobile/src/providers/auth-bootstrap-provider.tsx`
  - `apps/mobile/app/(app)/_layout.tsx`
  - `apps/mobile/app/(app)/(tabs)/account.tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - mobile consome `/auth/me`: ok
  - bootstrap de sessao implementado: ok
  - rotas autenticadas usam contexto real: ok
  - fallback de token invalido previsto: ok com sign-out em `401/403`
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - commit: pendente

## FT-043 - Implementar leitura inicial de foodtrucks e catalogo na API

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Criar primeira leitura funcional de foodtrucks, evento e catalogo para destravar consumo real nos frontends.
- **Dependencias:** `FT-011`, `FT-013`, `FT-023`, `FT-024`, `FT-025`, `FT-041`, `FT-042`
- **Criterios de aceite:**
  - endpoint de listagem de foodtrucks criado
  - endpoint de detalhes do foodtruck criado
  - endpoint de catalogo inicial criado
  - contratos documentados em OpenAPI
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/foodtrucks.dto.ts`
  - `apps/api/src/modules/foodtrucks/foodtrucks.service.ts`
  - `apps/api/src/modules/foodtrucks/foodtrucks.controller.ts`
  - `apps/api/src/modules/foodtrucks/foodtrucks.module.ts`
  - `apps/api/src/modules/app.module.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - endpoint de listagem de foodtrucks criado: ok
  - endpoint de detalhes do foodtruck criado: ok
  - endpoint de catalogo inicial criado: ok
  - contratos documentados em OpenAPI: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - validacao runtime local dos endpoints: pendente por ausencia de `.env` local da API
  - commit: pendente

## FT-044 - Integrar admin ao catalogo real de foodtruck da API

- **Skill dona:** `next-admin-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Substituir placeholders do admin por leitura real de foodtruck e catalogo onde fizer sentido.
- **Dependencias:** `FT-041`, `FT-043`
- **Criterios de aceite:**
  - dados reais exibidos no admin
  - carregamento e estado vazio previstos
  - erro de API tratado
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/admin/src/lib/foodtrucks-api.ts`
  - `apps/admin/src/components/console-shell.tsx`
  - `apps/admin/app/(console)/truck/menu/page.tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - dados reais exibidos no admin: ok
  - carregamento e estado vazio previstos: ok
  - erro de API tratado: ok
  - lint admin: ok
  - typecheck admin: ok
  - build admin: ok
  - commit: pendente

## FT-045 - Integrar mobile a foodtrucks e catalogo reais

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Substituir mocks do app cliente por leitura real de foodtrucks e catalogo.
- **Dependencias:** `FT-042`, `FT-043`
- **Criterios de aceite:**
  - lista de foodtrucks vem da API
  - detalhe do foodtruck vem da API
  - catalogo vem da API
  - estados de loading e erro previstos
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/mobile/src/lib/foodtrucks-api.ts`
  - `apps/mobile/app/(app)/(tabs)/trucks/index.tsx`
  - `apps/mobile/app/(app)/trucks/[truckId]/index.tsx`
  - `apps/mobile/app/(app)/trucks/[truckId]/menu/index.tsx`
  - `apps/mobile/app/(app)/trucks/[truckId]/menu/[itemId].tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - lista de foodtrucks vem da API: ok
  - detalhe do foodtruck vem da API: ok
  - catalogo vem da API: ok
  - estados de loading e erro previstos: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - commit: pendente

## FT-046 - Definir baseline oficial de auth frontend

- **Skill dona:** `auth-rbac`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Formalizar o provider e as versoes oficiais de auth para admin e mobile com base em compatibilidade real de build.
- **Dependencias:** `FT-014`, `FT-036`, `FT-040`
- **Criterios de aceite:**
  - baseline oficial do auth web definida
  - baseline oficial do auth mobile definida
  - riscos e bloqueios de compatibilidade registrados
  - impacto no backlog e na version-matrix atualizado
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `docs/architecture/version-matrix.md`
  - `backlog.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - baseline oficial do auth web definida: ok
  - baseline oficial do auth mobile definida: ok
  - riscos e bloqueios registrados: ok
  - impacto no backlog e na version-matrix atualizado: ok
  - commit: pendente

---

# EPIC 11 - Dados de desenvolvimento para catalogo realista

## FT-047 - Definir contrato de onboarding para foodtrucks de desenvolvimento

- **Skill dona:** `product-system-design`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Definir o formato canonico de entrada para foodtrucks de desenvolvimento, incluindo identidade, imagens, catalogo, disponibilidade e regra de validacao antes de importar cada empresa.
- **Dependencias:** `FT-043`, `FT-044`, `FT-045`
- **Criterios de aceite:**
  - checklist de dados por foodtruck definido
  - formato minimo de imagem definido
  - formato minimo de catalogo definido
  - regra de importacao uma a uma definida
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `docs/product/dev-foodtruck-onboarding.md`
  - `backlog.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - checklist de dados por foodtruck definido: ok
  - formato minimo de imagem definido: ok
  - formato minimo de catalogo definido: ok
  - regra de importacao uma a uma definida: ok
  - commit: pendente

## FT-048 - Importar foodtruck de desenvolvimento Funky Chicken

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Cadastrar Funky Chicken como foodtruck de desenvolvimento com identidade visual, descricao e catalogo validos para renderizacao real no mobile.
- **Dependencias:** `FT-047`
- **Criterios de aceite:**
  - foodtruck disponivel na API
  - imagem e dados renderizam corretamente no mobile
  - catalogo renderiza corretamente no mobile
  - estados de erro e fallback permanecem coerentes
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/api/src/modules/foodtrucks/foodtrucks.dto.ts`
  - `apps/api/src/modules/foodtrucks/foodtrucks.service.ts`
  - `apps/mobile/assets/dev-foodtrucks/funky-chicken/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
  - `apps/mobile/src/lib/foodtrucks-api.ts`
  - `apps/mobile/app/(app)/(tabs)/trucks/index.tsx`
  - `apps/mobile/app/(app)/trucks/[truckId]/index.tsx`
  - `apps/mobile/app/(app)/trucks/[truckId]/menu/index.tsx`
  - `apps/mobile/app/(app)/trucks/[truckId]/menu/[itemId].tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - foodtruck disponivel na API: ok via fixture de desenvolvimento
  - imagem e dados renderizam corretamente no mobile: ok
  - catalogo renderiza corretamente no mobile: ok
  - estados de erro e fallback permanecem coerentes: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - observacoes faltantes do payload original: normalizadas para ambiente de desenvolvimento
  - commit: pendente

## FT-049 - Importar foodtruck de desenvolvimento Soulistic Food Truck

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Cadastrar Soulistic Food Truck como foodtruck de desenvolvimento com identidade visual, descricao e catalogo validos para renderizacao real no mobile.
- **Dependencias:** `FT-047`, `FT-048`
- **Criterios de aceite:**
  - foodtruck disponivel na API
  - imagem e dados renderizam corretamente no mobile
  - catalogo renderiza corretamente no mobile
  - estados de erro e fallback permanecem coerentes
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/mobile/assets/dev-foodtrucks/soulistic-food-truck/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - foodtruck disponivel na API: ok via fixture de desenvolvimento
  - imagem e dados renderizam corretamente no mobile: ok
  - catalogo renderiza corretamente no mobile: ok
  - estados de erro e fallback permanecem coerentes: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - precos e imagens de item normalizados a partir da referencia do stitch: ok
  - commit: pendente

## FT-050 - Importar foodtruck de desenvolvimento Ceylon Food Truck

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Cadastrar Ceylon Food Truck como foodtruck de desenvolvimento com identidade visual, descricao e catalogo validos para renderizacao real no mobile.
- **Dependencias:** `FT-047`, `FT-049`
- **Criterios de aceite:**
  - foodtruck disponivel na API
  - imagem e dados renderizam corretamente no mobile
  - catalogo renderiza corretamente no mobile
  - estados de erro e fallback permanecem coerentes
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/mobile/assets/dev-foodtrucks/ceylon-food-truck/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - foodtruck disponivel na API: ok via fixture de desenvolvimento
  - imagem e dados renderizam corretamente no mobile: ok
  - catalogo renderiza corretamente no mobile: ok
  - estados de erro e fallback permanecem coerentes: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - precos normalizados a partir da referencia do usuario: ok
  - correspondencia item-imagem parcial tratada como fixture de desenvolvimento: ok
  - commit: pendente

## FT-051 - Importar foodtruck de desenvolvimento Argentina Grill

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Cadastrar foodtruck de desenvolvimento com proposta argentina grill, foco em fogo, parrilla, chorizo, catering premium e experiencia visual forte.
- **Dependencias:** `FT-047`, `FT-050`
- **Criterios de aceite:**
  - foodtruck disponivel na API
  - imagem e dados renderizam corretamente no mobile
  - catalogo renderiza corretamente no mobile
  - estados de erro e fallback permanecem coerentes
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/mobile/assets/dev-foodtrucks/fuego-del-sur-grill/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - foodtruck disponivel na API: ok via fixture de desenvolvimento
  - imagem e dados renderizam corretamente no mobile: ok
  - catalogo renderiza corretamente no mobile: ok
  - estados de erro e fallback permanecem coerentes: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - correspondencia item-imagem boa com uma lacuna sem imagem para empanada: ok para desenvolvimento
  - commit: pendente

## FT-052 - Importar foodtruck de desenvolvimento Brasil Tradicional

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Cadastrar foodtruck de desenvolvimento com proposta de comfort food brasileira, comida afetiva, festival cultural, salgados e prato tipico.
- **Dependencias:** `FT-047`, `FT-051`
- **Criterios de aceite:**
  - foodtruck disponivel na API
  - imagem e dados renderizam corretamente no mobile
  - catalogo renderiza corretamente no mobile
  - estados de erro e fallback permanecem coerentes
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/mobile/assets/dev-foodtrucks/sabores-do-brasil-truck/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - foodtruck disponivel na API: ok via fixture de desenvolvimento
  - imagem e dados renderizam corretamente no mobile: ok
  - catalogo renderiza corretamente no mobile: ok
  - estados de erro e fallback permanecem coerentes: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - identidade visual provisoria do stitch aplicada sobre naming textual diferente: ok para desenvolvimento
  - commit: pendente

## FT-053 - Importar foodtruck de desenvolvimento Taiwanese Bubble Tea

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Cadastrar foodtruck de desenvolvimento com proposta jovem e urbana de bubble tea taiwanes, bebidas visuais e snacks rapidos.
- **Dependencias:** `FT-047`, `FT-052`
- **Criterios de aceite:**
  - foodtruck disponivel na API
  - imagem e dados renderizam corretamente no mobile
  - catalogo renderiza corretamente no mobile
  - estados de erro e fallback permanecem coerentes
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/mobile/assets/dev-foodtrucks/formosa-bubble-and-bites/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
- **Revisao:** `aprovada`
- **Validacoes:**
  - foodtruck disponivel na API: ok via fixture de desenvolvimento
  - imagem e dados renderizam corretamente no mobile: ok
  - catalogo renderiza corretamente no mobile: ok
  - estados de erro e fallback permanecem coerentes: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - identidade visual provisoria do stitch aplicada sobre naming textual diferente: ok para desenvolvimento
  - correspondencia item-imagem parcial normalizada para ambiente de desenvolvimento: ok
  - commit: pendente

## FT-054 - Substituir fixture brasileira provisoria por Casa Brasil

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `nao`
- **Descricao:** Substituir a fixture provisoria de foodtruck brasileira por `Casa Brasil`, consolidando dados, imagens e catalogo com melhor correspondencia real entre itens e material visual.
- **Dependencias:** `FT-052`
- **Criterios de aceite:**
  - fixture brasileira anterior substituida sem quebrar a API
  - imagens e dados de Casa Brasil renderizam corretamente no mobile
  - catalogo atualizado cobre acai, salgados, doces e bebida
  - validacao final de lint, typecheck, doctor e build/export concluida
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/src/modules/foodtrucks/dev-foodtrucks.data.ts`
  - `apps/mobile/assets/dev-foodtrucks/casa-brasil/*`
  - `apps/mobile/src/lib/dev-foodtruck-media.ts`
  - `backlog.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - fixture brasileira anterior substituida: ok
  - imagens e dados de Casa Brasil: ok
  - catalogo atualizado: ok
  - lint api: ok
  - typecheck api: ok
  - build api: ok
  - lint mobile: ok
  - typecheck mobile: ok
  - expo doctor: ok
  - build/export mobile: ok
  - cobertura visual combinada entre `stitch (36)` e `stitch (37)`: ok
  - commit: pendente

---

# READY atuais

- nenhuma task `READY` no momento

---

# Ordem sugerida para comecar

- reavaliar backlog e abrir o proximo ciclo funcional do MVP

---

# EPIC 12 - Validacao local em emulador

## FT-055 - Preparar backend local para testes em emulador

- **Skill dona:** `nest-api-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Validar pre-requisitos locais da API, gerar Prisma Client, revisar `.env` e subir o backend para consumo do app mobile em ambiente de desenvolvimento.
- **Dependencias:** `FT-043`, `FT-054`
- **Criterios de aceite:**
  - `prisma generate` executado sem erro
  - variaveis locais minimas da API validadas
  - API sobe localmente sem erro de bootstrap
  - endpoint base acessivel para o mobile local
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/api/.env`
  - `apps/api/prisma.config.ts`
  - `apps/api/src/main.ts`
  - `backlog.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - `prisma generate`: ok
  - variaveis locais minimas da API: ok
  - container PostgreSQL identificado em `127.0.0.1:54333`: ok
  - API sobe localmente sem erro de bootstrap: ok
  - observacao operacional: `apps/api/.env.example` ainda referencia `54329`, mas o ambiente local validado usa `54333`
  - commit: pendente

## FT-056 - Configurar execucao local do mobile para emulador

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Configurar o app mobile para apontar para a API local no ambiente de desenvolvimento e preparar a execucao no emulador.
- **Dependencias:** `FT-055`
- **Criterios de aceite:**
  - `EXPO_PUBLIC_API_BASE_URL` validada para o emulador
  - app mobile sobe em modo dev sem erro de bootstrap
  - navegacao inicial abre no emulador
  - consumo inicial da API responde no app
- **Entrega em:** `2026-03-28`
- **Artefatos:**
  - `apps/mobile/.env`
  - `backlog.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - `EXPO_PUBLIC_API_BASE_URL` para Android emulator: ok com `http://10.0.2.2:3000`
  - mobile lint: ok
  - mobile typecheck: ok
  - emulador Android detectado: ok
  - Metro iniciado localmente em `http://localhost:8081`: ok
  - Expo Go aberto no Android emulator via `adb`: ok
  - observacao: a validacao funcional de descoberta/detalhe/catalogo fica para `FT-057`
  - commit: pendente

## FT-057 - Validar fluxo basico no emulador

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Validar no emulador o fluxo basico de descoberta, detalhe de foodtruck e catalogo com a API local em execucao.
- **Dependencias:** `FT-056`, `FT-059`
- **Criterios de aceite:**
  - lista de foodtrucks abre no emulador
  - detalhe de foodtruck abre no emulador
  - catalogo abre no emulador
  - erros de conectividade ou runtime, se existirem, ficam registrados com causa exata
- **Observacoes de execucao em:** `2026-03-28`
  - backend local corrigido para usar `127.0.0.1:54333` no `.env`
  - `/foodtrucks`: ok apos fallback para fixtures quando `Event` nao existe no banco local
  - `/foodtrucks/funky-chicken`: ok
  - `/foodtrucks/funky-chicken/catalog`: ok
  - Expo/Metro em `http://localhost:8081`: ok
  - emulador Android ativo com tela real de sign-in do Clerk: ok
  - bloqueio atual: falta uma sessao Clerk valida para atravessar o gate de auth do app e validar visualmente lista, detalhe e catalogo no emulador
  - evidencia do bloqueio: tentativa controlada com credencial invalida retornou `Couldn't find your account.`
  - causa registrada: sem sessao valida o layout autenticado redireciona para `/(auth)/sign-in`, impedindo a navegacao visual da aba de trucks
  - decisao de reentrada em `2026-03-30`: a retomada oficial passa primeiro por consolidacao do estado real de auth/Clerk e depois por estabilizacao formal do fluxo real antes da validacao funcional final
  - nova tentativa em `2026-03-30` com configuracao minima real sem `JWT template`: login no mobile chegou ate `signIn.create()`, mas o Clerk respondeu `form_identifier_not_found: Couldn't find your account.`
  - confirmacao do ponto de falha em `2026-03-30`: o bloqueio atual ainda acontece antes de `/auth/me`, portanto nao ha evidencia de falha por ausencia de `JWT template` neste teste
  - repeticao oficial em `2026-03-30` apos confirmacao do usuario no tenant atual: `signIn.create()` continuou retornando `form_identifier_not_found: Couldn't find your account.`
  - estado confirmado em `2026-03-30`: `setActive()`, `/auth/me`, entrada autenticada e validacao de lista/detalhe/catalogo continuam sem evidencia porque o bloqueio permanece no login primario do Clerk
  - nova repeticao oficial em `2026-03-30` com a credencial `ricardo.foodtruck.test01@gmail.com`: o bloqueio mudou para `form_password_incorrect: Password is incorrect. Try again, or use another method.`
  - estado confirmado em `2026-03-30` para a nova credencial: o Clerk reconheceu o identificador, mas a sessao ainda nao foi criada; `setActive()`, `/auth/me`, entrada autenticada e lista/detalhe/catalogo permanecem sem evidencia funcional
  - nova repeticao oficial em `2026-03-30` apos criar o JWT template `foodtrucks-api` e configurar `EXPO_PUBLIC_CLERK_JWT_TEMPLATE`: o app voltou ao formulario real do projeto no emulador, o email foi aceito e a senha ficou mascarada na UI, mas o submit falhou com `form_param_nil: Enter password.`
  - estado confirmado em `2026-03-30` para a tentativa com template: nao ha evidencia valida de `signIn.create()` porque o formulario enviou `password` vazio apesar do campo visualmente preenchido; `setActive()`, `/auth/me`, entrada autenticada e lista/detalhe/catalogo continuam sem evidencia funcional nesta rodada
  - revalidacao oficial em `2026-03-30`: `signIn.create()`, `setActive()` e `GET /auth/me` passaram com o template `foodtrucks-api`; o `AppLayout` entrou em `phase: ready` e a aba `BARRACAS` exibiu a lista real de foodtrucks no emulador
  - estado oficial apos estabilizacao minima de auth em `2026-03-30`: o bloqueio por JWT/Clerk foi removido; o restante desta task fica restrito a evidenciar detalhe e catalogo no emulador, sem abrir nova frente de auth
  - tentativa final de conclusao em `2026-03-30`: a lista permaneceu validada visualmente no emulador, mas o toque automatizado no card nao abriu o detalhe e a abertura por rota direta deixou o Expo Go preso na tela de transicao; detalhe e catalogo seguem sem evidencia visual concluida nesta rodada
  - conclusao oficial em `2026-03-30`: a lista passou a usar `ScrollView` real no Expo Go, os cards ficaram clicaveis via `Pressable`, o toque no card `Funky Chicken` abriu a tela de detalhe, o CTA `Abrir cardapio` abriu o catalogo e o catalogo respondeu a scroll real no emulador; a evidencia visual de lista -> detalhe -> catalogo ficou concluida
  - logs de navegacao adicionados no mobile para registrar estado da lista, card pressionado, rota e carregamento de detalhe/catalogo durante a validacao visual
  - commit: `fix(mobile): close emulator navigation flow for ft-057`

---

# EPIC 13 - Reentrada limpa do fluxo de auth

## FT-058 - Consolidar estado real do fluxo de auth Clerk entre mobile, admin e API

- **Skill dona:** `auth-rbac`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Regularizar o estado real do projeto antes de retomar a validacao em emulador, absorvendo oficialmente o trabalho feito fora do fluxo, revisando auth/Clerk entre mobile, admin e API e alinhando backlog, codigo e execucao.
- **Dependencias:** `FT-056`, `FT-040`, `FT-041`, `FT-042`, `FT-046`
- **Criterios de aceite:**
  - commit e mudancas locais fora do backlog em auth/Clerk ficam mapeados
  - worktree de auth/admin/mobile/api fica classificado entre `fica`, `descarta` ou `vira task posterior`
  - flags temporarias, bypasses e callbacks auxiliares ficam decididos e registrados
  - divergencias entre backlog e implementacao ficam explicitadas no backlog
  - backlog passa a refletir a sequencia oficial de retomada sem ambiguidade
- **Escopo entra:**
  - revisar o commit `f9553aa` e os diffs locais ligados a auth, token, bootstrap e callbacks Clerk
  - decidir o destino de arquivos novos e alteracoes em `apps/mobile`, `apps/admin` e `apps/api`
  - registrar o que foi descoberto fora do fluxo oficial e o que permanece como base valida
  - preparar o backlog para a estabilizacao formal do auth real antes de reabrir a validacao funcional
- **Escopo nao entra:**
  - validar visualmente descoberta, detalhe e catalogo no emulador
  - expandir escopo de produto, catalogo, pedidos ou pagamentos
  - abrir novas frentes fora de auth/contexto autenticado
- **Riscos:**
  - consolidar hack temporario como base oficial
  - perder evidencia util de investigacao recente
  - misturar regularizacao com implementacao nova fora do escopo
- **Subagente executor ideal:** `auth-rbac`
- **Subagente revisor ideal:** `mobile-app-architecture`
- **Entrega em:** `2026-03-30`
- **Artefatos:**
  - `backlog.md`
  - `apps/admin/src/lib/auth-context.ts`
  - `apps/api/.env.example`
  - `apps/api/src/modules/auth/auth.guard.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/mobile/app/(app)/(tabs)/_layout.tsx`
  - `apps/mobile/app/(auth)/sign-in.tsx`
  - `apps/mobile/src/providers/auth-bootstrap-provider.tsx`
- **Revisao:** `aprovada`
- **Validacoes:**
  - commit `f9553aa` mapeado e comparado com backlog: ok
  - worktree de auth/admin/mobile/api classificado entre manter e descartar: ok
  - bypass temporario de bootstrap autenticado removido: ok
  - callbacks experimentais sem cobertura oficial descartados: ok
  - suporte explicito a `CLERK_JWT_TEMPLATE` mantido em mobile, admin e `.env.example`: ok
  - `apps/api/.env.example` alinhado ao PostgreSQL validado em `127.0.0.1:54333`: ok
  - ajuste de Expo Router para tabs indexadas mantido como correcao valida: ok
  - mobile lint: ok
  - mobile typecheck: ok
  - admin lint: ok
  - admin typecheck: ok
  - api lint: ok
  - api typecheck: ok
  - commit: ok
- **Observacoes de consolidacao em:** `2026-03-30`
  - existe commit fora do backlog: `f9553aa Fix mobile auth bootstrap navigation loop`
  - partes absorvidas do desvio: guardas de carregamento do Clerk, instrumentacao util de sign-in, suporte a template JWT, protecao contra `CLERK_SECRET_KEY` placeholder e correcao de tabs do Expo Router
  - partes descartadas do desvio: bypass por `EXPO_PUBLIC_DISABLE_AUTH_BOOTSTRAP`, helper e callbacks experimentais do Clerk sem task oficial e drift acidental em arquivos `Claude/*` e `expo-env`
  - `FT-059` passa a ser a proxima task oficial para estabilizar auth real antes da retomada funcional
  - `FT-057` permanece bloqueada ate a conclusao de `FT-059`
- **Commit:** `chore(auth): consolidate real clerk auth state before emulator validation`

## FT-059 - Estabilizar auth real para validacao em emulador

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Estabilizar oficialmente o fluxo real de auth Clerk entre mobile, admin e API para permitir validacao em emulador sem bypass e com contrato autenticado coerente.
- **Dependencias:** `FT-058`
- **Criterios de aceite:**
  - emissao e consumo de token Clerk ficam coerentes entre mobile, admin e API
  - bootstrap autenticado via `/auth/me` funciona sem bypass temporario
  - callbacks e configuracoes necessarias de Clerk ficam documentados no estado oficial
  - erros de `401`, `403` ou token ausente ficam reproduziveis e explicados
- **Entrega em:** `2026-03-30`
- **Artefatos:**
  - `backlog.md`
  - `apps/admin/.env.example`
  - `apps/admin/src/lib/auth-context.ts`
  - `apps/mobile/.env.example`
  - `apps/mobile/src/lib/auth-api.ts`
  - `apps/mobile/src/providers/auth-bootstrap-provider.tsx`
  - `apps/mobile/app/(app)/_layout.tsx`
  - `apps/mobile/app/(app)/(tabs)/account.tsx`
  - `docs/auth/auth-strategy.md`
  - `docs/auth/clerk-runtime-config.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - admin local fixado em `http://localhost:3001` para nao conflitar com a API: ok
  - exemplos oficiais de `.env` adicionados para admin e mobile: ok
  - diagnostico de `missing-token`, `401` e `403` enriquecido em admin e mobile: ok
  - baseline oficial desta fase documentado sem callback hospedado ou OAuth nativo: ok
  - mobile lint: ok
  - mobile typecheck: ok
  - mobile build/export web: ok
  - admin lint: ok
  - admin typecheck: ok
  - admin build: ok
  - api lint: ok
  - api typecheck: ok
  - api build: ok
  - observacao operacional: a validacao funcional com credencial Clerk real continua em `FT-057`
- **Observacoes de estabilizacao em:** `2026-03-30`
  - o runtime local agora diferencia `missing-token`, `401` e `403` com mensagens acionaveis
  - `apps/admin/.env` local foi criado fora de versionamento para alinhar `API_BASE_URL` e `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - o baseline oficial desta fase usa email e senha com `signIn.create()` + `setActive()` no mobile e `SignIn` do Clerk no admin
  - callback hospedado, OAuth nativo e SSO continuam fora do escopo oficial
  - `FT-057` permanece bloqueada somente pela ausencia de credencial Clerk valida para evidencia funcional final no emulador
- **Commit:** `chore(auth): stabilize local clerk runtime contract before emulator validation`

## FT-060 - Fechar auth minima funcional do mobile

- **Skill dona:** `mobile-app-architecture`
- **Status:** `DONE`
- **Fluxo critico:** `sim`
- **Descricao:** Encerrar uma camada minima e funcional de autenticacao no mobile para nao travar mais o MVP, mantendo login Clerk, sessao, `getToken({ template: "foodtrucks-api" })`, `/auth/me`, protecao basica de layout e retry simples antes de `signOut`.
- **Dependencias:** `FT-059`
- **Criterios de aceite:**
  - sign-in mobile funciona com Clerk
  - `setActive()` funciona
  - `getToken({ template: "foodtrucks-api" })` funciona
  - `GET /auth/me` funciona
  - `AppLayout` separa fluxo autenticado e nao autenticado
  - um `401` transitorio nao causa `signOut` imediato
  - logs minimos permitem diagnosticar token ausente, tentativa de `/auth/me` e falhas basicas do backend
- **Entrega em:** `2026-03-30`
- **Artefatos:**
  - `apps/mobile/src/providers/auth-bootstrap-provider.tsx`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/api/src/modules/auth/auth.guard.ts`
  - `docs/auth/clerk-runtime-config.md`
  - `backlog.md`
- **Revisao:** `aprovada`
- **Validacoes:**
  - mobile sign-in com Clerk: ok
  - `setActive()`: ok
  - `GET /auth/me` com template `foodtrucks-api`: ok
  - `AppLayout` autenticado vs nao autenticado: ok
  - retry simples antes de `signOut` no `401`: ok
  - mobile typecheck: ok
  - api build: ok
- **Observacoes de encerramento em:** `2026-03-30`
  - a validacao JWT basica ficou comprovada; nao e necessario mexer em provider, publishable key ou template atual nesta fase
  - o backend passou a diferenciar melhor bearer ausente/malformado, falha em `verifyToken`, claims inesperadas e falhas posteriores de dominio para diagnostico
  - o endurecimento ficou propositalmente minimo para nao travar o fluxo do MVP
  - hardening mais amplo, testes automatizados e observabilidade de auth ficam explicitamente adiados para task futura
- **Commit:** `chore(auth): close minimal mobile auth baseline`

## FT-061 - Hardening e testes de auth

- **Skill dona:** `auth-rbac`
- **Status:** `TODO`
- **Fluxo critico:** `nao`
- **Descricao:** Reforcar auth apos o destravamento do MVP com foco em hardening, observabilidade e testes automatizados.
- **Dependencias:** `FT-060`
- **Escopo previsto:**
  - hardening de sessao e erros intermitentes
  - revisao de roles e permissoes
  - observabilidade estruturada de auth
  - testes automatizados de login, bootstrap e `/auth/me`
  - cleanup tecnico da instrumentacao temporaria
- **Observacao:** task futura; nao bloqueia a retomada das features do MVP

---

# READY atuais

- nenhuma task `READY` no momento

---

# Ordem sugerida para comecar

- retomar imediatamente as tasks de produto/MVP desbloqueadas apos a auth minima funcional
- deixar `FT-061` para a proxima frente tecnica de hardening e testes
