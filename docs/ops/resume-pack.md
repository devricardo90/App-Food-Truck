# RESUME PACK

## O que e este projeto

Aplicacao de operacao e consumo no contexto Foodtrucks, com fluxo mobile para cliente e painel/admin operacional para barraca, validada contra `staging`.

## Objetivo atual

Checkpoint fechado apos validar o pipeline minimo de build Android distribuivel do mobile com EAS Build, mantendo o app apontado para `staging` e sem abrir producao, loja ou rollout amplo.

## Stack aprovada

* Frontend: Next.js `16.2.1`
* Backend: NestJS `11.x`
* Mobile: React Native com Expo SDK `52`
* Banco: PostgreSQL `16.13`
* ORM: Prisma `7.4.1`
* Auth: Clerk
* Package manager: pnpm `10.x`

## Estado operacional

* Task ativa: nenhuma
* Ultima task concluida: `FT-091 - Preparar pipeline minimo de build distribuivel do mobile`
* Status atual: checkpoint fechado; `FT-091 = DONE` no backlog canonico
* Bloqueado?: nao
* Proximo passo: fazer retriagem curta antes de qualquer nova frente; nao abrir nova `READY` automaticamente
* Evidencia final: build Android interna gerada com sucesso via EAS, link/QR disponivel, app baixado e instalado no emulador, app iniciado com sucesso
* Causa do bloqueio anterior: Node incompatibilidade com `prisma preinstall` no builder remoto durante `Install dependencies`
* Correcao validada: fixar `node: "22.12.0"` no profile `preview-staging`
* Runbook EAS: validado na pratica

## Regras criticas

* backlog e a fonte de verdade
* status nao substitui backlog
* nao abrir `READY` artificial
* nao alterar stack/versoes sem registro
* nao marcar `DONE` sem evidencia real
* handoff deve refletir o estado exato e atual do projeto

## Arquivos que precisam ser lidos primeiro

1. `AGENTS.md`
2. `docs/ops/session-handoff.md`
3. `docs/architecture/version-matrix.md`
4. `docs/ops/backlog.md`

## Atencoes especiais

* O backlog canonico atual esta em `backlog.md` na raiz.
* `docs/ops/backlog.md` e apenas um ponteiro operacional; nao duplica nem substitui o backlog canonico.
* `status.md` nao e fonte de verdade; serve apenas como resumo executivo manual.
* `FT-091` foi aberta por decisao explicita do owner para avancar EAS Build.
* `FT-091` esta `DONE` porque houve build bem-sucedida, instalacao e inicializacao no emulador, e runbook validado.
* A causa objetiva do bloqueio anterior foi incompatibilidade de Node remoto com `prisma preinstall`.
* O mobile contra `staging` ja estava formalizado via `Expo Go` em `LAN`; agora tambem ha build Android interna/controlada com EAS validada.
* Sem nova demanda concreta, nao abrir frente para loja, producao, iOS, EAS Submit, EAS Update, CI/CD mobile ou rollout amplo.
* O contexto operacional de staging aprovado para o fluxo remoto foi alinhado para `funky-chicken`.
