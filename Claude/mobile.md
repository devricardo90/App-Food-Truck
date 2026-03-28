apps/mobile

App do cliente.

Responsável por:

login/cadastro
lista de barracas
cardápio
carrinho
checkout
status do pedido
notificações
histórico

Estrutura sugerida: apps/mobile/
├─ app/
│ ├─ (auth)/
│ ├─ (public)/
│ ├─ (customer)/
│ └─ \_layout.tsx
├─ src/
│ ├─ features/
│ │ ├─ auth/
│ │ ├─ trucks/
│ │ ├─ menu/
│ │ ├─ cart/
│ │ ├─ checkout/
│ │ ├─ orders/
│ │ └─ notifications/
│ ├─ components/
│ ├─ hooks/
│ ├─ services/
│ ├─ store/
│ ├─ lib/
│ ├─ schemas/
│ ├─ types/
│ └─ config/
├─ assets/
├─ app.json
└─ package.json
