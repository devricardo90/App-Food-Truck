# SESSION HANDOFF

## Objetivo atual do projeto

FT-092 foi encerrada documental e operacionalmente apos a revalidacao manual do
mobile contra `staging`, preservando o foco de portfolio profissional sem
expandir dominio, auth, pagamento, schema, producao ou distribuicao.

## Task encerrada nesta sessao

`FT-092 - Polir experiencia demonstravel do fluxo validado para portfolio`.

Status operacional: `DONE` em `2026-04-23`.

## Ultima task concluida

`FT-092 - Polir experiencia demonstravel do fluxo validado para portfolio`.

Checkpoint anterior aprovado:

- `FT-086 = DONE`
- `FT-087 = DONE`
- `FT-088 = DONE`
- `FT-091 = DONE`
- `FT-092 = DONE`

## Estado atual da FT-092

Implementado:

- mobile: polish em descoberta, detalhe da barraca, cardapio, detalhe do item,
  carrinho, checkout, pagamento pendente e detalhe do pedido
- mobile: correcao minima no CTA `Add to cart` com lock local contra reentrada
  e `disabled` visual durante a transicao para o carrinho
- admin: polish na fila operacional da barraca, acoes de transicao e shell de
  console usado pelos cards
- docs: `backlog.md`, `docs/ops/status.md`, `docs/ops/session-handoff.md` e
  `docs/quality/ft-092/evidence.md`
- divergencia documental de `FT-091` corrigida em `docs/ops/status.md`
- fechamento documental e operacional alinhado para `DONE`

Validado:

- `pnpm.cmd --filter @foodtrucks/mobile run typecheck`: PASS
- `pnpm.cmd --filter @foodtrucks/mobile run test`: PASS
- `pnpm.cmd --filter @foodtrucks/admin run typecheck`: PASS
- `pnpm.cmd --filter @foodtrucks/admin run test`: PASS
- admin local respondeu `200` em `http://localhost:3010` com `next dev` ativo
- mobile Expo abriu listener local em `0.0.0.0:8085` fora do sandbox
- o owner revalidou manualmente o mobile contra `staging` apos a correcao do
  CTA `Add to cart`
- clique unico em `Add to cart` sem reentrada repetida: OK
- continuidade do fluxo manual do carrinho ate checkout: OK

Fechado nesta retomada em `2026-04-23`:

- mobile `.env` local alinhado para `EXPO_PUBLIC_API_BASE_URL=https://foodtrucks-api-staging-staging.up.railway.app`
- admin `.env` local alinhado para `API_BASE_URL` e `NEXT_PUBLIC_API_BASE_URL` de staging
- `GET /health` da API de staging respondeu `200` com `{"status":"ok","service":"api",...}`
- o problema do admin nao era ausencia real do `next` na raiz; o binario hoisted funciona via `node ..\\..\\node_modules\\next\\dist\\bin\\next`
- `pnpm --filter @foodtrucks/admin exec next ...` continua quebrado porque `apps/admin/node_modules/next` aponta para um junction invalido fora do modelo hoisted atual
- o CTA `Add to cart` do mobile agora tem guarda local contra reentrada para
  impedir disparos repetidos do mesmo clique antes da navegacao
- o workaround do admin foi revalidado: `node ..\\..\\node_modules\\next\\dist\\bin\\next dev --hostname 127.0.0.1 --port 3010` sobe fora do sandbox
- o bootstrap local do mobile tambem foi revalidado fora do sandbox com Expo
  ouvindo em `8085` para a rodada manual contra staging
- a revalidacao manual do owner removeu o bloqueio residual da FT-092 e tornou a
  task elegivel para `DONE`

## Bloqueios

* `pnpm.cmd --filter @foodtrucks/mobile run build` falhou no sandbox com
  `spawn EPERM`; a tentativa escalada excedeu o timeout.
* Lint global mobile/admin falha por problemas preexistentes fora do recorte,
  especialmente `.codex-test` gerado e CRLF em arquivos ja modificados antes
  da FT-092.
* `pnpm --filter @foodtrucks/admin exec next ...` continua quebrado porque
  `apps/admin/node_modules/next/dist/bin/next` aponta para um junction invalido
  fora do modelo hoisted atual; o workaround confirmado continua sendo o binario
  hoisted da raiz.
* `next dev` e `expo start` batem `spawn EPERM` no sandbox; a verificacao de
  runtime precisa continuar fora do sandbox.

## Proximos 3 passos

1. Consultar o `backlog.md` canonico antes de iniciar qualquer nova frente.
2. Nao abrir nova task `READY` artificialmente neste handoff.
3. Manter o proximo ciclo restrito a retriagem do backlog pelo Protocolo Rick.

## Evidencia registrada

* Antes: `docs/quality/ft-092/before-mobile-home.png`
* Antes: `docs/quality/ft-092/before-mobile-menu.png`
* Antes: `docs/quality/ft-092/before-mobile-payment.png`
* Antes: `docs/quality/ft-092/before-mobile-order-final.png`
* Tentativas depois: `docs/quality/ft-092/after-mobile-trucks.png`
* Tentativas depois: `docs/quality/ft-092/after-android-current.png`
* Tentativas depois: `docs/quality/ft-092/after-android-auth-min.png`
* Tentativas depois: `docs/quality/ft-092/after-android-trucks-deeplink.png`
* Registro consolidado: `docs/quality/ft-092/evidence.md`

## Decisoes que nao podem ser quebradas

* O backlog canonico continua sendo a fonte de verdade.
* FT-092 ja foi encerrada como `DONE`; nao reabrir a task sem evidencia real de
  regressao no fluxo demonstravel validado.
* Nao abrir pagamento real, multi-truck avancado, producao, loja, iOS, EAS
  Submit, EAS Update, CI/CD, observabilidade estrutural, auth estrutural ou
  mudanca de schema dentro da FT-092.
* Nao corrigir lint global ou normalizar CRLF fora do recorte desta task sem
  task propria.
