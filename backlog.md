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
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Preparar backend para validar identidade e autorizacao.
- **Dependencias:** `FT-009`, `FT-014`, `FT-015`
- **Criterios de aceite:**
  - guard base criado
  - user context resolvido
  - autorizacao por role prevista

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
- **Status:** `READY`
- **Fluxo critico:** `nao`
- **Descricao:** Configurar roteamento, styling e libs de estado, forms e server state.
- **Dependencias:** `FT-017`
- **Criterios de aceite:**
  - Expo Router funcionando
  - NativeWind funcionando
  - Zustand configurado
  - TanStack Query configurado
  - RHF + Zod configurados

## FT-019 - Criar estrutura de rotas do app cliente

- **Skill dona:** `mobile-app-architecture`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Criar rotas base para auth, trucks, menu, cart e orders.
- **Dependencias:** `FT-018`, `FT-007`
- **Criterios de aceite:**
  - rotas principais criadas
  - layouts base definidos
  - navegacao inicial funcional

---

# EPIC 06 - Painel admin web

## FT-020 - Inicializar app admin Next.js

- **Skill dona:** `next-admin-architecture`
- **Status:** `READY`
- **Fluxo critico:** `nao`
- **Descricao:** Criar base do painel web em Next.js.
- **Dependencias:** `FT-001`, `FT-002`
- **Criterios de aceite:**
  - app Next criado
  - Tailwind configurado
  - estrutura base criada

## FT-021 - Configurar UI base do admin

- **Skill dona:** `next-admin-architecture`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Configurar componentes e layout base do painel.
- **Dependencias:** `FT-020`, `FT-008`
- **Criterios de aceite:**
  - layout autenticado criado
  - navegacao lateral/topo criada
  - paginas base acessiveis

## FT-022 - Criar estrutura de rotas do admin

- **Skill dona:** `next-admin-architecture`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Criar rotas base para dashboard, pedidos, cardapio, relatorios e setup central.
- **Dependencias:** `FT-021`
- **Criterios de aceite:**
  - rotas principais criadas
  - separacao entre area barraca e area central prevista

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
- **Status:** `READY`
- **Fluxo critico:** `nao`
- **Descricao:** Modelar o fluxo da mensalidade paga pela barraca a plataforma.
- **Dependencias:** `FT-005`
- **Criterios de aceite:**
  - regra de cobranca definida
  - status de assinatura definidos
  - impacto em acesso da barraca previsto

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
- **Status:** `READY`
- **Fluxo critico:** `nao`
- **Descricao:** Padronizar scripts de qualidade no monorepo.
- **Dependencias:** `FT-001`, `FT-002`, `FT-003`
- **Criterios de aceite:**
  - script de lint funcional
  - script de typecheck funcional
  - script de test funcional

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

# READY atuais

- `FT-016` - Integrar auth no backend
- `FT-018` - Configurar Expo Router + NativeWind + libs base
- `FT-020` - Inicializar app admin Next.js
- `FT-027` - Definir cobranca mensal da plataforma
- `FT-029` - Configurar scripts de lint, typecheck e test

---

# Ordem sugerida para comecar

1. `FT-018` - Configurar Expo Router + NativeWind + libs base
2. `FT-020` - Inicializar app admin Next.js
3. `FT-016` - Integrar auth no backend
4. `FT-027` - Definir cobranca mensal da plataforma
5. `FT-029` - Configurar scripts de lint, typecheck e test
