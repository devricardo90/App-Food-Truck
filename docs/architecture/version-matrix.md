# Version Matrix

Foodtrucks Platform

## Status

Approved baseline for initial implementation.

## Regras

- Nunca usar `latest` em dependencia critica.
- Toda mudanca de versao exige task propria no backlog.
- Toda mudanca de versao exige revisao do orquestrador.
- Toda instalacao deve respeitar compatibilidade da stack.
- No ecossistema Expo, usar `npx expo install` quando aplicavel.
- No ecossistema Expo, o SDK e a fonte principal de compatibilidade.
- Se a versao nao estiver definida aqui, a task deve parar e voltar para revisao.

---

## Ambiente base

- Node.js: `22.x LTS`
- pnpm: `10.x`
- TypeScript: `5.8.x`
- Turbo: `2.5.x`
- ESLint: `10.x`
- Prettier: `3.3.0`

## Politica do ambiente base

- Preferir Node 22 LTS pela estabilidade de producao.
- Evitar Node Current na base do monorepo.
- Fixar pnpm no repositorio para reduzir diferencas entre maquinas.
- Usar ESLint na linha major estavel `10.x`.
- Fixar Prettier em `3.3.0`, sem range.
- Nunca usar `latest` para ESLint ou Prettier no projeto.
- Em Next.js 16, usar ESLint via CLI e nao depender de `next lint`.

---

## Mobile

App Cliente

- Expo SDK: `52`
- React Native: `resolver via Expo SDK 52`
- React: `resolver via Expo SDK 52`
- expo-router: `resolver via Expo SDK 52`
- react-native-reanimated: `resolver via Expo SDK 52`
- NativeWind: `4.1.x`
- Zustand: `5.x`
- `@tanstack/react-query`: `5.x`
- react-hook-form: `7.x`
- zod: `4.x`
- Clerk Expo SDK: `usar a linha atual compativel com Expo do projeto`
- Push: `expo-notifications` no app + FCM/OneSignal conforme task especifica

## Politica do mobile

- Criar o app primeiro com Expo SDK 52.
- Instalar `expo-router`, `react-native-reanimated`, `expo-notifications` e demais libs do ecossistema com `npx expo install`.
- Nao pinar manualmente React Native, React ou Expo Router fora do que o Expo resolver.
- Tratar o Expo SDK como ancora de compatibilidade do app mobile.
- Se a documentacao do Expo ajustar a versao interna de React Native dentro da mesma linha de SDK, prevalece a compatibilidade oficial do SDK.
- Nao usar NativeWind v5 no MVP; v5 esta em pre-release.
- Preferir NativeWind v4.1.x para estabilidade.
- Clerk no Expo deve seguir a documentacao oficial do SDK Expo da Clerk.
- Se houver duvida entre compatibilidade do Expo e de biblioteca third-party, prevalece a compatibilidade do Expo.

---

## Admin Web

Next.js

- Next.js: `16.2.x`
- React: `19.x`
- React DOM: `19.x`
- Tailwind CSS: `4.2.x`
- `@tanstack/react-query`: `5.x`
- react-hook-form: `7.x`
- zod: `4.x`
- Clerk Next.js SDK: `linha atual compativel com Next 16 do projeto`

## Politica do admin

- Basear o painel em Next.js 16.2.x.
- Manter React e React DOM na linha suportada pelo Next 16.
- Usar Tailwind v4 no painel.
- Toda integracao de auth no web deve validar compatibilidade do SDK Clerk com o Next do projeto antes do install.

---

## API

NestJS

- NestJS: `11.x`
- prisma: `7.4.1`
- @prisma/client: `7.4.1`
- `@prisma/adapter-pg`: `7.4.1`
- PostgreSQL: `16.13`
- `pg`: `8.x`
- `@nestjs/swagger`: `11.2.6`
- `@scalar/nestjs-api-reference`: `1.1.4`
- Stripe SDK: `linha atual estavel compativel com Node 22`
- Firebase Admin SDK: `linha atual estavel compativel com Node 22`
- Twilio SDK: `linha atual estavel compativel com Node 22`

## Politica da API

- Basear a API em Nest 11.
- Manter `prisma` e `@prisma/client` na versao exata `7.4.1`.
- Manter `@prisma/adapter-pg` na versao exata `7.4.1`.
- `prisma` e `@prisma/client` devem sempre ficar na mesma versao.
- `@prisma/adapter-pg` deve acompanhar a linha oficial do Prisma do projeto.
- Fixar PostgreSQL 16.13 para o baseline inicial.
- Para Prisma 7 + PostgreSQL, usar `generator client { provider = "prisma-client" output = "..." }`.
- `prisma.config.ts` e obrigatorio desde o inicio.
- `pg` e obrigatorio para Prisma 7 com PostgreSQL.
- `@prisma/adapter-pg` e obrigatorio para Prisma 7 com PostgreSQL.
- Prisma nao garante instalacao automatica do driver PostgreSQL.
- Prisma nao deve ser instanciado sem `adapter` nesse setup.
- `pg` deve ser instalado explicitamente e ser compativel com Node 22 LTS.
- revisar pool e timeout do `pg` como parte do runtime da API.
- validar SSL explicitamente quando o banco for remoto.
- se o app da API migrar o Prisma Client para setup ESM, validar coerencia de `package.json` e runtime.
- `prisma://` e `prisma+postgres://` pertencem ao fluxo de Accelerate e nao ao fluxo de adapter TCP direto.
- Swagger entra no Sprint 1 da API.
- Scalar entra logo apos Swagger.
- Servir Swagger UI via `SwaggerModule.setup(...)` sem adicionar dependencia HTTP extra separada.
- SDKs externos devem ser aprovados por compatibilidade com Node 22 e Nest 11 antes do install.

---

## Documentacao da API

- OpenAPI: obrigatorio
- Swagger UI: obrigatorio
- Scalar API Reference: obrigatorio

## Regra de documentacao

- Endpoint novo sem documentacao minima nao pode virar DONE.
- Alteracao de contrato exige atualizacao do OpenAPI no mesmo ciclo.
- DTO, params, query, body e responses devem refletir o contrato real.

---

## Ordem obrigatoria de instalacao

### Monorepo

1. Node 22 LTS
2. pnpm 10
3. Turborepo
4. TypeScript base
5. ESLint / Prettier / configs compartilhadas

### Mobile

1. Criar app Expo
2. Fixar SDK 52
3. Instalar pacotes Expo com `npx expo install`
4. Expo Router
5. Reanimated
6. NativeWind
7. Zustand
8. TanStack Query
9. React Hook Form + Zod
10. Auth
11. Notifications
12. Payments

### Admin

1. Criar app Next 16.2
2. Garantir React/React DOM compativeis
3. Tailwind 4
4. UI base
5. TanStack Query
6. React Hook Form + Zod
7. Auth
8. Features

### API

1. Criar app Nest 11
2. Estrutura de modulos e config
3. Prisma 7.4.1
4. PostgreSQL
5. Swagger
6. Scalar
7. Auth
8. Payments
9. Notifications
10. Observability

---

## Politica de upgrade

- Nunca atualizar varias dependencias criticas na mesma task sem necessidade real.
- Upgrades devem ser incrementais.
- Apos upgrade:
  - lint
  - typecheck
  - tests
  - build
  - revisao de docs
  - revisao de backlog impactado

---

## Observacoes

- A stack mobile deve tratar o Expo SDK como centro de compatibilidade.
- NativeWind v5 nao entra no MVP.
- PostgreSQL 16.13 e a baseline proposta; upgrade de major so com task propria.
- Swagger e Scalar sao parte do produto interno da API, nao detalhe opcional.
- `prisma` e `@prisma/client` devem permanecer sincronizados na mesma versao.
- `@prisma/adapter-pg` faz parte obrigatoria do runtime Prisma 7 com PostgreSQL.
- `pg` e parte obrigatoria do runtime quando Prisma 7 falar com PostgreSQL.
- Metrics preview antigo do Prisma nao entra no plano do projeto.
