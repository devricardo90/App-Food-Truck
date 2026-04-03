# Ambientes e Deploy Inicial

## Objetivo

Definir o baseline oficial de ambientes, secrets e deploy para o monorepo sem acoplar a stack a um provedor especifico nesta fase.

Esta documentacao fecha a FT-032 no nivel correto: protocolo operacional, fronteiras entre ambientes e plano inicial de publicacao.

## Ambientes oficiais

### `local`

- uso: desenvolvimento diario, debugging e bootstrap de dados locais
- apps:
  - admin em `http://localhost:3001`
  - api em `http://127.0.0.1:3000`
  - mobile Expo apontando para `http://10.0.2.2:3000` no emulador Android
- banco:
  - PostgreSQL local
- caracteristicas:
  - pode usar dataset local de operador e dataset operacional minimo
  - logs mais verbosos sao aceitaveis
  - secrets locais ficam apenas em `.env` nao versionado

### `staging`

- uso: validacao integrada antes de expor mudancas em producao
- apps:
  - admin publicado separadamente
  - api publicada separadamente
  - mobile validado contra a API remota de staging
- banco:
  - PostgreSQL dedicado de staging, nunca compartilhado com producao
- caracteristicas:
  - base de dados descartavel e sem dependencia de dados manuais de producao
  - Clerk separado por ambiente ou configuracao claramente segmentada
  - observabilidade e logs ja devem refletir o comportamento esperado de producao

### `production`

- uso: operacao real
- apps:
  - admin publicado em dominio oficial
  - api publicada em dominio oficial
  - mobile consumindo endpoints oficiais
- banco:
  - PostgreSQL dedicado de producao com backup e controle de acesso
- caracteristicas:
  - secrets apenas no provedor de deploy ou cofre oficial
  - nenhuma credencial de staging reaproveitada
  - migrations e rollout exigem trilha controlada

## Separacao por superficie

### Admin

- natureza: app web Next.js
- deploy esperado:
  - build do app com `pnpm --filter @foodtrucks/admin build`
  - hospedagem estatica ou serverless compatibel com Next
- variaveis principais:
  - `API_BASE_URL`
  - `NEXT_PUBLIC_API_BASE_URL`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_JWT_TEMPLATE`
  - `NEXT_PUBLIC_CLERK_JWT_TEMPLATE`

### API

- natureza: backend NestJS com Prisma e PostgreSQL
- deploy esperado:
  - build com `pnpm --filter @foodtrucks/api build`
  - processo Node dedicado apontando para banco gerenciado
- variaveis principais:
  - `PORT`
  - `DATABASE_URL`
  - `CLERK_SECRET_KEY`
  - `CLERK_JWT_KEY`
  - `CLERK_JWT_TEMPLATE`
  - `CLERK_AUDIENCE`
  - `CLERK_AUTHORIZED_PARTIES`

### Mobile

- natureza: app Expo
- baseline oficial desta fase:
  - desenvolvimento e validacao principal por build local e emulador
  - o deploy inicial nao depende de pipeline de distribuicao publica
- variaveis principais:
  - `EXPO_PUBLIC_API_BASE_URL`
  - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_CLERK_JWT_TEMPLATE`

## Estrategia oficial de secrets

### Regras

- `.env` reais nunca entram no git
- `.env.example` e a fonte versionada de shape, nunca de valor real
- cada app possui apenas as variaveis necessarias ao seu runtime
- secrets de servidor nunca devem aparecer em `NEXT_PUBLIC_*` ou `EXPO_PUBLIC_*`
- publishable keys de Clerk podem existir em variaveis publicas; secret keys nao

### Segmentacao

- local:
  - secrets ficam em arquivos `.env` locais fora de versionamento
- staging:
  - secrets ficam no painel do provedor ou em cofre dedicado
  - valores de staging devem ser totalmente separados dos de producao
- production:
  - secrets ficam apenas no provedor oficial ou cofre central
  - rotacao precisa ser possivel sem editar codigo

### Ownership minimo

- API:
  - dona de `DATABASE_URL` e `CLERK_SECRET_KEY`
- Admin:
  - dono apenas de URLs publicas e publishable key
- Mobile:
  - dono apenas de URLs publicas e publishable key publica

## Matriz minima por ambiente

| Superficie | Local | Staging | Production |
| --- | --- | --- | --- |
| Admin | `.env` local | secrets no deploy do admin | secrets no deploy do admin |
| API | `.env` local | secrets no deploy da API | secrets no deploy da API |
| Mobile | `.env` local | config publica de build | config publica de build |
| Banco | PostgreSQL local | PostgreSQL dedicado | PostgreSQL dedicado |
| Clerk | credenciais locais de desenvolvimento | app/config separada | app/config separada |

## Plano inicial de deploy

### Fase 1

- publicar a API em ambiente remoto com banco dedicado
- publicar o admin contra essa API remota
- manter o mobile inicialmente em distribuicao controlada de desenvolvimento, apontando para staging

### Fase 2

- adicionar staging persistente como ambiente obrigatorio antes de producao
- automatizar build e release por branch protegida
- definir rotina de migrations e rollback

### Fase 3

- promover producao com dominios oficiais
- habilitar observabilidade e trilha minima de incidentes
- formalizar distribuicao do mobile para canal externo quando essa frente entrar no backlog

## Checklist minimo antes do primeiro deploy remoto

1. `apps/api/.env.example`, `apps/admin/.env.example` e `apps/mobile/.env.example` precisam refletir o shape atual real.
2. `pnpm typecheck` e `pnpm test` precisam passar na workspace.
3. a API precisa subir com `DATABASE_URL` remoto e `CLERK_SECRET_KEY` real, nunca placeholder.
4. admin e mobile precisam apontar para a base URL correta da API do ambiente.
5. staging e producao nao podem compartilhar banco nem secrets.

## Fora de escopo desta task

- escolher provedor especifico de hosting
- provisionar infra real
- criar pipeline CI/CD completa
- publicar build oficial de app store
- automatizar rollback, backup ou observabilidade avancada

## Relacao com outras frentes

- `FT-032` fecha a definicao de baseline de ambientes e deploy.
- a execucao concreta de provisionamento, pipeline e publicacao deve voltar em tasks proprias.
- auth continua usando o baseline ja estabilizado em `docs/auth/clerk-runtime-config.md`.
