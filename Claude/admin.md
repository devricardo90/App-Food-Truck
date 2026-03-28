apps/admin

Painel web para barraca e gestão central.

Responsável por:

login
dashboard da barraca
pedidos em tempo real
gestão de cardápio
estoque
relatórios
painel central
setup assistido
billing da plataforma

Estrutura sugerida: apps/admin/
├─ app/
│ ├─ (auth)/
│ ├─ (truck)/
│ ├─ (platform)/
│ ├─ api/
│ └─ layout.tsx
├─ src/
│ ├─ features/
│ │ ├─ auth/
│ │ ├─ truck-dashboard/
│ │ ├─ menus/
│ │ ├─ orders/
│ │ ├─ inventory/
│ │ ├─ reports/
│ │ ├─ assisted-setup/
│ │ ├─ subscriptions/
│ │ └─ platform-admin/
│ ├─ components/
│ ├─ hooks/
│ ├─ lib/
│ ├─ services/
│ ├─ schemas/
│ ├─ types/
│ └─ config/
├─ public/
└─ package.json
