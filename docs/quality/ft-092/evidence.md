# FT-092 - Evidencia visual e validacao

## Corte executado

Polish visual e operacional do fluxo demonstravel ja validado, sem alterar
dominio, schema, auth, pagamento real, producao, loja, iOS, EAS Submit, EAS
Update, CI/CD ou multi-truck avancado.

## Telas e componentes tocados

- Mobile: descoberta de barracas
- Mobile: detalhe da barraca
- Mobile: cardapio
- Mobile: detalhe do item
- Mobile: carrinho
- Mobile: checkout
- Mobile: pagamento pendente
- Mobile: detalhe do pedido
- Admin: fila de pedidos da barraca
- Admin: acoes de transicao de status
- Admin: shell de console usado pelos cards da fila

## Evidencia antes

Screenshots reaproveitados da validacao funcional anterior do fluxo mobile:

- `docs/quality/ft-092/before-mobile-home.png`
- `docs/quality/ft-092/before-mobile-menu.png`
- `docs/quality/ft-092/before-mobile-payment.png`
- `docs/quality/ft-092/before-mobile-order-final.png`

## Evidencia depois

Capturas tentadas nesta rodada:

- `docs/quality/ft-092/after-mobile-trucks.png`
- `docs/quality/ft-092/after-android-current.png`
- `docs/quality/ft-092/after-android-auth-min.png`
- `docs/quality/ft-092/after-android-trucks-deeplink.png`

Resultado objetivo:

- Expo web subiu localmente em `http://localhost:8094`.
- O emulador Android abriu o bundle via Expo Go.
- A tentativa de deep link para a area autenticada entrou no bootstrap de auth.
- A captura das telas tocadas ficou bloqueada por falha de `/auth/me` no mobile:
  `Network request failed`.
- O admin local nao abriu para screenshot porque o binario local de Next nao esta
  materializado em `apps/admin/node_modules/next/dist/bin/next`.

Por esse motivo, a FT-092 nao deve virar `DONE` nesta rodada. O codigo esta em
estado revisavel, mas falta evidencia visual autenticada das telas tocadas.

## Validacao executada

```bash
pnpm.cmd --filter @foodtrucks/mobile run typecheck
pnpm.cmd --filter @foodtrucks/admin run typecheck
pnpm.cmd --filter @foodtrucks/mobile run test
pnpm.cmd --filter @foodtrucks/admin run test
```

Resultado:

- Mobile typecheck: PASS
- Admin typecheck: PASS
- Mobile tests existentes: PASS
- Admin tests existentes: PASS

Validacoes adicionais tentadas:

```bash
pnpm.cmd --filter @foodtrucks/mobile run lint
pnpm.cmd --filter @foodtrucks/admin run lint
pnpm.cmd --filter @foodtrucks/mobile run build
```

Resultado:

- Lint mobile/admin: FAIL por problemas preexistentes fora do recorte, sobretudo
  `.codex-test` gerado e CRLF em arquivos ja modificados antes da FT-092.
- Mobile web export: FAIL no sandbox por `spawn EPERM`; tentativa escalada
  excedeu o tempo limite.

## Status da evidencia

FT-092 fica em `REVIEW`, nao `DONE`, ate haver uma sessao/ambiente que permita
capturar screenshots depois das telas autenticadas tocadas.
