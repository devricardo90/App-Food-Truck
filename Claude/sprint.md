Primeiro sprint do projeto

Vou te passar um Sprint 1 enxuto e forte, para criar a base certa.

Objetivo do Sprint 1

Deixar o projeto pronto para:

iniciar desenvolvimento sem bagunça
validar o fluxo base
construir o MVP sobre uma base profissional
Entregáveis do Sprint 1
Bloco 1 — fundação do monorepo
criar Turborepo
configurar pnpm-workspace
criar apps mobile, admin, api
criar packages compartilhados
configurar TypeScript base
configurar ESLint, Prettier e scripts
Bloco 2 — base do backend
subir NestJS
configurar Prisma + PostgreSQL
criar schema inicial
criar módulos base:
auth
users
trucks
menus
orders
payments
criar healthcheck
Bloco 3 — base do mobile
subir Expo
configurar Expo Router
configurar NativeWind
configurar Zustand
configurar TanStack Query
criar estrutura de rotas:
auth
trucks
menu
cart
orders
Bloco 4 — base do admin
subir Next.js
configurar Tailwind
configurar UI base
criar layout autenticado
criar rotas iniciais:
login
dashboard
orders
menu
settings
Bloco 5 — documentação mínima
README raiz
docs/product/mvp.md
docs/architecture/monorepo.md
docs/flows/order-flow.md
pasta docs/skills/

Sprint 1 quebrado em tasks
Task 1 — inicialização do repo
Criar monorepo com Turborepo + pnpm.
Adicionar apps/mobile, apps/admin e apps/api.
Adicionar packages compartilhados: types, schemas, utils, config e api-client.
Configurar turbo.json, pnpm-workspace.yaml, tsconfig base e scripts padrão.
Task 2 — setup backend
Inicializar NestJS em apps/api.
Configurar Prisma com PostgreSQL.
Criar schema inicial com entidades mínimas:
User, Company, Event, Truck, Menu, MenuItem, Order, OrderItem, Payment.
Criar migration inicial e health endpoint.
Task 3 — setup mobile
Inicializar Expo app em apps/mobile.
Configurar Expo Router, NativeWind, Zustand, TanStack Query, React Hook Form e Zod.
Criar estrutura base de rotas para auth, lista de trucks, cardápio, carrinho e pedidos.
Task 4 — setup admin
Inicializar Next.js em apps/admin.
Configurar Tailwind, shadcn/ui, TanStack Query, React Hook Form e Zod.
Criar layout autenticado e páginas base para dashboard, pedidos, cardápio e configurações.
Task 5 — autenticação base
Definir estratégia de autenticação do MVP.
Preparar integração com Clerk para mobile, admin e backend.
Mapear roles mínimas: customer, truck_owner, truck_staff, platform_admin.
Documentar fluxo de sessão e autorização.
Task 6 — contrato do pedido
Definir oficialmente o fluxo do pedido:
pending_payment -> new -> in_progress -> ready -> completed/cancelled.
Documentar gatilhos de transição e responsabilidades entre app, barraca e backend.
Task 7 — critérios de qualidade
Adicionar lint, typecheck e test scripts no monorepo.
Criar regra de commit baseada no Protocolo Rick.
Preparar pipeline inicial de CI para lint e typecheck.
Ordem ideal de execução

1. Task 1 — inicialização do repo
2. Task 2 — setup backend
3. Task 3 — setup mobile
4. Task 4 — setup admin
5. Task 5 — autenticação base
6. Task 6 — contrato do pedido
7. Task 7 — critérios de qualidade
