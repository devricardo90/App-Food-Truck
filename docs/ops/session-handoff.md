# SESSION HANDOFF

## Objetivo atual do projeto

Checkpoint fechado apos validar o caminho minimo de build Android distribuivel do mobile com EAS Build, mantendo o app apontado para `staging` e preservando o escopo controlado do MVP.

## Task em execucao

Nenhuma.

Status operacional: checkpoint fechado em `2026-04-12`. A `FT-091 - Preparar pipeline minimo de build distribuivel do mobile` esta `DONE` no backlog canonico.

## Ultima task concluida

`FT-091 - Preparar pipeline minimo de build distribuivel do mobile`.

Checkpoint atual ja aprovado:

- `FT-086 = DONE`
- `FT-087 = DONE`
- `FT-088 = DONE`
- `FT-091 = DONE`

## Proximos 3 passos

1. Fazer retriagem curta antes de qualquer nova frente.
2. Confirmar se existe demanda concreta para novo ciclo: testador externo, janela de validacao, producao, loja ou outra necessidade objetiva.
3. Se houver nova frente, abrir task propria no backlog canonico antes de executar.

## Bloqueios

* Nenhum bloqueio operacional ativo para a `FT-091`.
* Bloqueio anterior: `prisma preinstall` rejeitou a versao de Node do builder remoto durante `pnpm install --no-frozen-lockfile`.
* Evidencia anterior: `Prisma only supports Node.js versions 20.19+, 22.12+, 24.0+`.
* Correcao minima validada: `node: "22.12.0"` no profile `preview-staging`.

## Evidencia final da FT-091

* Build Android interna gerada com sucesso via EAS.
* Link/QR de distribuicao disponivel.
* App baixado no emulador Android.
* Instalacao concluida com sucesso.
* App iniciado com sucesso.
* Runbook EAS validado na pratica.

## Diff objetivo

* `apps/mobile/eas.json`: profile `preview-staging` fixa Node `22.12.0`, usa distribuicao interna, environment `preview`, API publica de `staging` e Android `apk`.
* `apps/mobile/app.json`: package Android de staging mantido para a build controlada.
* `docs/architecture/mobile-eas-build.md`: runbook minimo considerado validado pela execucao real.
* `backlog.md`, `docs/ops/session-handoff.md`, `docs/ops/resume-pack.md` e `status.md`: fechamento operacional registrado.

## Arquivos alterados recentemente

* `backlog.md`
* `status.md`
* `docs/architecture/mobile-staging-controlled-distribution.md`
* `docs/architecture/railway-staging.md`
* `docs/architecture/version-matrix.md`
* `docs/architecture/environments-and-deploy.md`
* `docs/auth/clerk-runtime-config.md`
* `docs/ops/backlog.md`
* `docs/ops/session-handoff.md`
* `docs/ops/resume-pack.md`
* `docs/ops/boot-rules.md`
* `apps/mobile/app.json`
* `apps/mobile/eas.json`
* `docs/architecture/mobile-eas-build.md`

## Comandos de validacao

```bash
pnpm --filter @foodtrucks/api run typecheck
pnpm --filter @foodtrucks/admin run typecheck
pnpm --filter @foodtrucks/mobile run typecheck
pnpm --filter @foodtrucks/api run test
pnpm --filter @foodtrucks/admin run test
pnpm --filter @foodtrucks/mobile run test
cd apps/mobile
eas build --platform android --profile preview-staging
```

## Versoes criticas

* Mobile runtime de validacao controlada: `Expo Go`
* Canal controlado anterior: `LAN`
* Canal validado: EAS Build Android interno/controlado
* Node remoto EAS para `preview-staging`: `22.12.0`
* Ambiente remoto validado: `staging`
* API de staging: `https://foodtrucks-api-staging-staging.up.railway.app`
* Node.js: `22.x LTS`
* pnpm: `10.x` (`packageManager`: `pnpm@10.30.3`)
* Mobile: Expo SDK `52`
* Admin: Next.js `16.2.1`
* Backend: NestJS `11.x`
* ORM: Prisma `7.4.1`
* Banco: PostgreSQL `16.13`
* Auth: Clerk

## Decisoes que nao podem ser quebradas

* O backlog canonico e a fonte de verdade.
* A `FT-091` so existe porque houve decisao explicita do owner para avancar EAS Build.
* `FT-091` esta `DONE` porque a build remota foi bem-sucedida, instalou e iniciou no emulador, e o runbook foi validado.
* Nao abrir nova `READY` automaticamente apos este fechamento.
* Fazer retriagem curta antes de qualquer nova frente.
* Nao abrir producao, loja, iOS, EAS Submit, EAS Update, CI/CD mobile ou rollout publico nesta task.
* Nao alterar versoes da stack sem registro explicito em task propria e na matriz de versoes.
* `DONE` exige evidencia real, nao suposicao.
* O roadmap esta pausado no checkpoint certo apos `FT-086`, `FT-087` e `FT-088`.
* O fluxo remoto do MVP ja foi validado ponta a ponta em `staging`.
* O canal minimo de validacao externa do mobile foi formalizado via `Expo Go` em `LAN`.
