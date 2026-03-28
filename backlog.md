# Backlog - Foodtrucks Platform

## Protocolo Rick V1.0

## Regras do fluxo

- Apenas tasks com status `READY` podem ser executadas.
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

---

# EPIC 01 - Fundacao do projeto

## FT-001 - Inicializar monorepo base

- **Skill dona:** `deployment-infra`
- **Status:** `READY`
- **Fluxo critico:** `nao`
- **Descricao:** Criar a base do monorepo com Turborepo, pnpm workspace, apps e packages compartilhados.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - `turbo.json` criado
  - `pnpm-workspace.yaml` criado
  - apps `mobile`, `admin` e `api` criados
  - packages compartilhados criados
  - scripts base funcionando na raiz

## FT-002 - Configurar TypeScript compartilhado

- **Skill dona:** `deployment-infra`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Criar configuracao base de TypeScript para todos os apps e packages.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - `tsconfig` base criado
  - apps herdando config compartilhada
  - packages herdando config compartilhada
  - typecheck basico funcionando

## FT-003 - Configurar ESLint e Prettier do monorepo

- **Skill dona:** `deployment-infra`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Padronizar lint e formatacao em todos os apps e packages.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - config compartilhada criada
  - scripts de lint funcionando
  - scripts de format/check funcionando

## FT-004 - Criar README raiz e documentacao minima

- **Skill dona:** `product-system-design`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Documentar objetivo do projeto, stack, estrutura do monorepo e fluxo MVP inicial.
- **Dependencias:** `FT-001`
- **Criterios de aceite:**
  - `README.md` raiz criado
  - `docs/product/mvp.md` criado
  - `docs/architecture/monorepo.md` criado
  - `docs/flows/order-flow.md` criado

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
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Mapear jornada do cliente, da barraca e da gestao central.
- **Dependencias:** `FT-005`
- **Criterios de aceite:**
  - jornada do cliente documentada
  - jornada da barraca documentada
  - jornada da gestao central documentada
  - pontos de friccao mapeados

## FT-007 - Definir mapa inicial de telas do mobile

- **Skill dona:** `ui-ux-pro-max`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Definir telas do app do cliente no MVP.
- **Dependencias:** `FT-006`
- **Criterios de aceite:**
  - telas essenciais listadas
  - navegacao principal definida
  - estados vazios e de erro previstos

## FT-008 - Definir mapa inicial de telas do admin

- **Skill dona:** `ui-ux-pro-max`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Definir telas do painel da barraca e do painel central.
- **Dependencias:** `FT-006`
- **Criterios de aceite:**
  - telas da barraca listadas
  - telas da gestao central listadas
  - acoes operacionais principais definidas

---

# EPIC 03 - Backend e dominio

## FT-009 - Inicializar backend NestJS

- **Skill dona:** `nest-api-architecture`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Criar app NestJS com estrutura inicial de modulos e healthcheck.
- **Dependencias:** `FT-001`, `FT-002`
- **Criterios de aceite:**
  - app NestJS criado
  - modulo principal configurado
  - endpoint health funcionando
  - estrutura `modules`, `common`, `config`, `prisma` criada

## FT-010 - Configurar Prisma + PostgreSQL

- **Skill dona:** `database-design`
- **Status:** `BLOCKED`
- **Fluxo critico:** `sim`
- **Descricao:** Integrar Prisma ao backend e configurar conexao com PostgreSQL.
- **Dependencias:** `FT-009`
- **Criterios de aceite:**
  - Prisma configurado
  - datasource funcionando
  - Prisma Client gerado
  - primeira conexao com banco validada

## FT-011 - Modelar schema inicial do dominio

- **Skill dona:** `database-design`
- **Status:** `BLOCKED`
- **Fluxo critico:** `sim`
- **Descricao:** Criar schema inicial com entidades principais do MVP.
- **Dependencias:** `FT-005`, `FT-010`
- **Criterios de aceite:**
  - entidades principais criadas
  - relacoes definidas
  - enums principais definidos
  - schema revisado para historico e multi-barraca

## FT-012 - Criar migration inicial

- **Skill dona:** `database-design`
- **Status:** `BLOCKED`
- **Fluxo critico:** `sim`
- **Descricao:** Gerar migration inicial do banco.
- **Dependencias:** `FT-011`
- **Criterios de aceite:**
  - migration criada
  - banco sincronizado
  - sem erro de geracao do client

## FT-013 - Definir modulos do backend

- **Skill dona:** `nest-api-architecture`
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Definir modulos iniciais do backend e fronteiras entre eles.
- **Dependencias:** `FT-005`, `FT-009`, `FT-011`
- **Criterios de aceite:**
  - modulos listados
  - responsabilidades por modulo definidas
  - dependencias entre modulos anotadas

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
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Definir papeis e permissoes minimas por area.
- **Dependencias:** `FT-014`
- **Criterios de aceite:**
  - roles definidas
  - permissoes por role documentadas
  - separacao entre barraca e gestao central garantida

## FT-016 - Integrar auth no backend

- **Skill dona:** `auth-rbac`
- **Status:** `BLOCKED`
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
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Criar base do app mobile com Expo.
- **Dependencias:** `FT-001`, `FT-002`
- **Criterios de aceite:**
  - app Expo criado
  - scripts de execucao funcionando
  - estrutura inicial estabelecida

## FT-018 - Configurar Expo Router + NativeWind + libs base

- **Skill dona:** `mobile-app-architecture`
- **Status:** `BLOCKED`
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
- **Status:** `BLOCKED`
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
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Definir throttling por slot de tempo para evitar sobrecarga da barraca.
- **Dependencias:** `FT-023`
- **Criterios de aceite:**
  - regra por janela definida
  - comportamento quando lotado definido
  - impacto no checkout previsto

## FT-025 - Definir regra de estoque diario

- **Skill dona:** `order-operations`
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Definir como o estoque do dia sera controlado no MVP.
- **Dependencias:** `FT-023`
- **Criterios de aceite:**
  - regra de disponibilidade definida
  - impacto em menu e checkout definido
  - fallback manual previsto

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
- **Status:** `BLOCKED`
- **Fluxo critico:** `nao`
- **Descricao:** Padronizar scripts de qualidade no monorepo.
- **Dependencias:** `FT-001`, `FT-002`, `FT-003`
- **Criterios de aceite:**
  - script de lint funcional
  - script de typecheck funcional
  - script de test funcional

## FT-030 - Definir estrategia minima de testes do MVP

- **Skill dona:** `testing-strategy`
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Definir quais fluxos criticos devem obrigatoriamente ter cobertura antes de staging.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - fluxos obrigatorios listados
  - niveis de teste definidos
  - criterios minimos de entrada em staging definidos

## FT-031 - Definir estrategia minima de logs e rastreabilidade

- **Skill dona:** `observability-support`
- **Status:** `READY`
- **Fluxo critico:** `sim`
- **Descricao:** Definir logs minimos para suporte de pedidos, pagamentos e notificacoes.
- **Dependencias:** nenhuma
- **Criterios de aceite:**
  - eventos criticos listados
  - identificadores de rastreio definidos
  - logs minimos por fluxo definidos

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

---

# READY atuais

- `FT-001` - Inicializar monorepo base
- `FT-006` - Definir jornadas oficiais das 3 personas
- `FT-015` - Definir roles e permissoes do sistema
- `FT-024` - Definir regra de capacidade por janela de tempo
- `FT-025` - Definir regra de estoque diario
- `FT-027` - Definir cobranca mensal da plataforma
- `FT-030` - Definir estrategia minima de testes do MVP
- `FT-031` - Definir estrategia minima de logs e rastreabilidade

---

# Ordem sugerida para comecar

1. `FT-001` - Inicializar monorepo base
2. `FT-006` - Definir jornadas oficiais das 3 personas
3. `FT-015` - Definir roles e permissoes do sistema
4. `FT-024` - Definir regra de capacidade por janela de tempo
5. `FT-025` - Definir regra de estoque diario
6. `FT-030` - Definir estrategia minima de testes do MVP
7. `FT-031` - Definir estrategia minima de logs e rastreabilidade
8. `FT-027` - Definir cobranca mensal da plataforma
