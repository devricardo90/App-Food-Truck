# RESUME PACK

## O que e este projeto

Aplicacao de operacao e consumo no contexto Foodtrucks, com fluxo mobile para
cliente e painel/admin operacional para barraca, validada contra `staging`.

## Objetivo atual

Retomar o projeto a partir do backlog canonico apos o fechamento documental e
operacional da `FT-092`, sem abrir novo escopo fora da priorizacao do Protocolo
Rick.

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
* Status atual: sem execucao de produto aberta apos o fechamento da `FT-092`
* Ultima task concluida: `FT-092 - Polir experiencia demonstravel do fluxo validado para portfolio`
* Bloqueado?: nao para a FT-092; pendencias remanescentes fora do recorte continuam documentadas
* Proximo passo: reler `backlog.md` e decidir a proxima frente somente pelo backlog canonico
* Validado nesta retomada: `typecheck` e `test` de mobile/admin; admin local `200` em `localhost:3010`; Expo local ouvindo em `8085` fora do sandbox; owner confirmou mobile contra `staging` ate checkout apos a correcao do CTA

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
* O workaround confirmado do admin continua sendo `node ..\\..\\node_modules\\next\\dist\\bin\\next dev --hostname 127.0.0.1 --port 3010` em `apps/admin`.
* `pnpm --filter @foodtrucks/admin exec next ...` continua quebrado por junction invalido em `apps/admin/node_modules/next`.
* `next dev` e `expo start` batem `spawn EPERM` no sandbox; runtime precisa ser revalidado fora do sandbox.
* O mobile ja tem `.env` local alinhado para `https://foodtrucks-api-staging-staging.up.railway.app`.
* A FT-092 ja foi fechada; qualquer reabertura exige evidencia real de regressao no fluxo validado.
