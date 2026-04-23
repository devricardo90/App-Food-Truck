# STATUS OPERACIONAL

Este arquivo nao e fonte de verdade.

A fonte canonica de status e roadmap permanece em `backlog.md` na raiz.

Resumo atual:

- `FT-086 = DONE`
- `FT-087 = DONE`
- `FT-088 = DONE`
- `FT-091 = DONE`
- `FT-092 = DONE`

## Divergencia corrigida em 2026-04-20

Este arquivo marcava `FT-091 = BLOCKED`, mas `backlog.md` e
`docs/ops/session-handoff.md` ja registravam `FT-091 = DONE`.

Correcao aplicada:

- `FT-091` volta a refletir o backlog canonico: `DONE`
- a evidencia final permanece a build Android interna/controlada via EAS,
  instalada e iniciada com sucesso no emulador
- a correcao minima validada da FT-091 permanece `node: "22.12.0"` no profile
  `preview-staging`

## Fechamento atual

`FT-092 - Polir experiencia demonstravel do fluxo validado para portfolio`
foi encerrada como `DONE`.

Motivo do fechamento:

- polish visual/copy/feedback aplicado em telas centrais mobile/admin
- diagnostico manual identificou e fechou o bloqueio P1 no `Add to cart` do mobile
- a correcao minima aplicada foi uma guarda local contra reentrada no `onPress`
- `pnpm.cmd --filter @foodtrucks/mobile run typecheck`: PASS
- `pnpm.cmd --filter @foodtrucks/mobile run test`: PASS
- o owner confirmou manualmente em dispositivo o fluxo mobile contra `staging` apos a correcao
- o clique unico no CTA voltou a levar ao carrinho sem travar a UI e o fluxo seguiu ate checkout

Evidencia operacional:

- o conjunto de capturas antes/depois permanece em `docs/quality/ft-092/`
- o registro consolidado da task permanece em `docs/quality/ft-092/evidence.md`
- o backlog canonico e o handoff foram atualizados para refletir o encerramento

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
