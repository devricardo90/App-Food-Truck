# STATUS OPERACIONAL

Este arquivo nao e fonte de verdade.

A fonte canonica de status e roadmap permanece em `backlog.md` na raiz.

Resumo atual:

- `FT-086 = DONE`
- `FT-087 = DONE`
- `FT-088 = DONE`
- `FT-091 = DONE`
- `FT-092 = REVIEW`

## Divergencia corrigida em 2026-04-20

Este arquivo marcava `FT-091 = BLOCKED`, mas `backlog.md` e
`docs/ops/session-handoff.md` ja registravam `FT-091 = DONE`.

Correcao aplicada:

- `FT-091` volta a refletir o backlog canonico: `DONE`
- a evidencia final permanece a build Android interna/controlada via EAS,
  instalada e iniciada com sucesso no emulador
- a correcao minima validada da FT-091 permanece `node: "22.12.0"` no profile
  `preview-staging`

## Frente atual

`FT-092 - Polir experiencia demonstravel do fluxo validado para portfolio`
esta em `REVIEW`.

Motivo:

- polish visual/copy/feedback aplicado em telas centrais mobile/admin
- typecheck mobile/admin: PASS
- testes existentes mobile/admin: PASS
- evidencia visual depois das telas autenticadas ainda nao fechou

Bloqueio residual da FT-092:

- mobile em Expo Go entrou no bootstrap autenticado, mas `/auth/me` falhou com
  `Network request failed`
- admin local nao abriu para screenshot porque o binario local de Next nao esta
  materializado em `apps/admin/node_modules/next/dist/bin/next`

Fora de escopo mantido:

- producao
- loja
- rollout publico
- iOS
- EAS Submit
- EAS Update
- CI/CD de build mobile
- pagamento real
- multi-truck avancado
- auth estrutural
- mudanca de schema
