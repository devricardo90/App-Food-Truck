Backend central em NestJS.

Responsável por:

auth
usuários
organizações/barracas
eventos
cardápios
pedidos
pagamentos
notificações
relatórios
observabilidade

Estrutura sugerida: apps/api/
├─ src/
│ ├─ modules/
│ │ ├─ auth/
│ │ ├─ users/
│ │ ├─ companies/
│ │ ├─ events/
│ │ ├─ trucks/
│ │ ├─ menus/
│ │ ├─ menu-items/
│ │ ├─ inventory/
│ │ ├─ orders/
│ │ ├─ payments/
│ │ ├─ notifications/
│ │ ├─ subscriptions/
│ │ ├─ assisted-setup/
│ │ ├─ reports/
│ │ └─ health/
│ ├─ common/
│ │ ├─ guards/
│ │ ├─ decorators/
│ │ ├─ filters/
│ │ ├─ interceptors/
│ │ ├─ pipes/
│ │ └─ logger/
│ ├─ prisma/
│ ├─ config/
│ ├─ app.module.ts
│ └─ main.ts
├─ prisma/
│ ├─ schema.prisma
│ ├─ migrations/
│ └─ seed.ts
└─ package.json
