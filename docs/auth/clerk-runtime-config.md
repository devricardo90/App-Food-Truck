# Configuracao Runtime do Clerk

## Objetivo

Padronizar a configuracao minima de Clerk entre mobile, admin e API para que o contrato `GET /auth/me` funcione sem bypass e com erro diagnostico reproduzivel.

## Variaveis da API

Arquivo de referencia: `apps/api/.env.example`

- `CLERK_SECRET_KEY`
  - chave secreta real do ambiente
- `CLERK_JWT_KEY`
  - opcional quando a validacao usar a chave JWT publica do Clerk
- `CLERK_JWT_TEMPLATE`
  - nome do template de JWT emitido para os clientes que consomem a API
- `CLERK_AUDIENCE`
  - audience esperada pelo backend quando o template emitir esse claim
- `CLERK_AUTHORIZED_PARTIES`
  - lista separada por virgula quando o backend precisar restringir origens autorizadas

## Variaveis do mobile

Arquivo de referencia: `apps/mobile/.env.example`

- `EXPO_PUBLIC_API_BASE_URL`
  - base URL da API acessivel pelo emulador
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - publishable key do app mobile
- `EXPO_PUBLIC_CLERK_JWT_TEMPLATE`
  - template de JWT usado em `getToken()` antes de chamar `/auth/me`

## Variaveis do admin

Arquivo de referencia: `apps/admin/.env.example`

- `API_BASE_URL` ou `NEXT_PUBLIC_API_BASE_URL`
  - base URL da API para consultar `/auth/me`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - publishable key do painel admin
- `CLERK_JWT_TEMPLATE` ou `NEXT_PUBLIC_CLERK_JWT_TEMPLATE`
  - template de JWT usado no `auth().getToken()`

## Baseline oficial de callback e redirect URI

- mobile
  - o baseline oficial desta fase e login por email e senha com `signIn.create()` + `setActive()`
  - esse fluxo nao depende de callback hospedado nem de redirect URI customizada
- admin
  - o baseline oficial desta fase e o componente `SignIn` do Clerk no Next com `routing=\"hash\"`
  - esse fluxo tambem nao exige callback adicional para a etapa atual
- regra
  - callback hospedado, OAuth nativo e SSO ficam fora do escopo oficial desta task
  - se esses fluxos forem retomados no futuro, devem voltar em task propria

## Endpoints locais de referencia

- admin local: `http://localhost:3001`
- API local: `http://127.0.0.1:3000`
- mobile Android emulator: `http://10.0.2.2:3000`

## Contrato operacional

1. Clerk autentica o usuario no cliente.
2. O cliente solicita bearer token com o template de JWT configurado.
3. O cliente chama `GET /auth/me`.
4. A API valida assinatura, audience e authorized parties quando configuradas.
5. A API resolve usuario, memberships e foodtruck ativo.

## Diagnostico rapido

### `missing-token`

- a sessao existe, mas `getToken()` nao retornou bearer token
- revisar template de JWT no cliente e no dashboard do Clerk

### `401` em `/auth/me`

- token ausente, invalido ou emitido com template/claims incorretos
- revisar `CLERK_JWT_TEMPLATE`, `CLERK_AUDIENCE` e sessao ativa

### `403` em `/auth/me`

- identidade valida, mas sem membership ou contexto autorizado
- revisar user local, memberships e foodtruck ativo

### placeholder de secret na API

- se `CLERK_SECRET_KEY="sk_test_example"`, o backend falha propositalmente
- isso evita falso positivo de auth em ambiente mal configurado

## Ordem pratica de validacao

1. confirmar publishable key no cliente
2. confirmar sessao Clerk criada com sucesso
3. confirmar `getToken()` no cliente
4. confirmar `GET /auth/me` com bearer token
5. confirmar a diferenca entre `401` e `403`

## Escopo desta fase

- o fluxo oficial estabilizado e email + senha com sessao real do Clerk
- callbacks hospedados e fluxos alternativos nao fazem parte da base oficial desta task
