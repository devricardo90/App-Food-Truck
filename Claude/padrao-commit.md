# Padrao de Commit

Use este formato:

`<type>(<scope>): <short description in english>`

## Tipos

- `feat`
- `fix`
- `refactor`
- `docs`
- `test`
- `chore`
- `perf`
- `style`
- `build`
- `ci`

## Exemplos

- `feat(mobile): add customer cart and checkout flow`
- `feat(admin): create truck order board with status columns`
- `feat(api): implement order creation and status transitions`
- `fix(api): prevent order confirmation before payment webhook`
- `refactor(shared): extract order status constants to shared package`
- `docs(product): add mvp flow for foodtruck ordering`
- `test(api): cover payment webhook idempotency`
- `chore(repo): configure turbo, pnpm workspace and shared tsconfig`
- `ci(repo): add lint and typecheck pipeline`

## Checklist obrigatorio antes do commit

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. validar build do app alterado
5. revisar envs impactadas
6. revisar migracao Prisma se houve mudanca no banco
7. atualizar `backlog.md`

## Regra extra do Protocolo Rick

Se mexeu em:

- pedido
- pagamento
- notificacao
- auth
- banco

o commit so entra se tiver:

- validacao do fluxo critico
- impacto descrito
- testes minimos do cenario
