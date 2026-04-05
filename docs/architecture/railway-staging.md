# Railway Staging

## Objetivo

Registrar o baseline reproduzivel de `staging` para `api` e `admin` na Railway.

Esta documentacao existe para evitar ambiente magico. O staging inicial deve ser reproduzivel por configuracao versionada e por comandos documentados.

## Provedor oficial desta fase

- Railway para `api`, `admin` e `PostgreSQL` de `staging`

## Servicos esperados

- `foodtrucks-staging-db`
- `foodtrucks-api-staging`
- `foodtrucks-admin-staging`

## Config as code versionada

- config da API: [`apps/api/railway.json`](/C:/Users/ricardodev/Desktop/App-Food-Truck/apps/api/railway.json)
- config do admin: [`apps/admin/railway.json`](/C:/Users/ricardodev/Desktop/App-Food-Truck/apps/admin/railway.json)
- Dockerfile da API: [`apps/api/Dockerfile`](/C:/Users/ricardodev/Desktop/App-Food-Truck/apps/api/Dockerfile)
- Dockerfile do admin: [`apps/admin/Dockerfile`](/C:/Users/ricardodev/Desktop/App-Food-Truck/apps/admin/Dockerfile)

## Variaveis obrigatorias por servico

### API

- `DATABASE_URL`
  - origem esperada: referencia ao `Postgres.DATABASE_URL` do servico de banco
- `RAILWAY_DOCKERFILE_PATH=/Dockerfile`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_KEY`
  - opcional, conforme estrategia do ambiente
- `CLERK_JWT_TEMPLATE`
- `CLERK_AUDIENCE`
  - opcional
- `CLERK_AUTHORIZED_PARTIES`
  - opcional
- `PORT`
  - injetada pela Railway

### Admin

- `RAILWAY_DOCKERFILE_PATH=/Dockerfile`
- `API_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_JWT_TEMPLATE`
- `NEXT_PUBLIC_CLERK_JWT_TEMPLATE`
- `PORT`
  - injetada pela Railway

## Provisionamento inicial

### 1. Instalar e autenticar CLI

```bash
npm install -g @railway/cli
railway login
```

### 2. Criar ou linkar projeto

```bash
railway init
```

Use um projeto dedicado de `staging`.

### 3. Criar o banco PostgreSQL

```bash
railway add -d postgres
```

Renomear o servico para `foodtrucks-staging-db`.

### 4. Criar os servicos vazios

```bash
railway add
```

Criar:

- `foodtrucks-api-staging`
- `foodtrucks-admin-staging`

### 5. Configurar os servicos para usar o Dockerfile versionado

Definir em cada servico a variavel:

- API: `RAILWAY_DOCKERFILE_PATH=/Dockerfile`
- Admin: `RAILWAY_DOCKERFILE_PATH=/Dockerfile`

Cada deploy sobe apenas o diretório do app correspondente com `--path-as-root`, reduzindo upload, evitando timeout do monorepo inteiro e mantendo o fluxo reproduzível por CLI.

### 6. Configurar variaveis

#### API

```txt
DATABASE_URL=${{Postgres.DATABASE_URL}}
RAILWAY_DOCKERFILE_PATH=/Dockerfile
CLERK_SECRET_KEY=<real_secret>
CLERK_JWT_KEY=<optional_or_blank>
CLERK_JWT_TEMPLATE=<staging_template>
CLERK_AUDIENCE=<optional_or_blank>
CLERK_AUTHORIZED_PARTIES=<optional_or_blank>
```

#### Admin

```txt
RAILWAY_DOCKERFILE_PATH=/Dockerfile
API_BASE_URL=<staging_api_url>
NEXT_PUBLIC_API_BASE_URL=<staging_api_url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<staging_publishable_key>
CLERK_JWT_TEMPLATE=<staging_template>
NEXT_PUBLIC_CLERK_JWT_TEMPLATE=<staging_template>
```

### 7. Deploy inicial

Depois de linkar o projeto, cada deploy pode ser repetido por CLI a partir da raiz do monorepo:

```bash
railway service link foodtrucks-api-staging
railway up apps/api --service foodtrucks-api-staging --environment staging --path-as-root
```

```bash
railway service link foodtrucks-admin-staging
railway up apps/admin --service foodtrucks-admin-staging --environment staging --path-as-root
```

O fluxo minimo oficial fica ancorado nesses comandos e nas variaveis versionadas/documentadas, nao em configuracao manual solta.

## Validacao minima pos-deploy

### API

- abrir `https://<api-staging>/docs`
- esperar resposta `200`
- confirmar que a aplicacao iniciou apos `prisma migrate deploy`

### Admin

- abrir `https://<admin-staging>/login`
- esperar resposta `200`
- confirmar que o painel carrega com a publishable key configurada

### Contrato auth

- confirmar que o admin de staging consegue ao menos tentar resolver `/auth/me` contra a API remota
- qualquer falha aqui deve ser classificada entre configuracao Clerk, token, permissao ou deploy

## URLs finais de staging

- API staging: `https://foodtrucks-api-staging-staging.up.railway.app`
- Admin staging: `https://foodtrucks-admin-staging-staging.up.railway.app`

## Pendencias nao bloqueantes desta fase

- pipeline CI/CD automatizada
- custom domain
- rollout de producao
- distribuicao tecnica do mobile contra o staging

## CI/CD minima proposta para staging

- workflow versionado: `.github/workflows/staging-ci-cd.yml`
- gatilhos:
  - `pull_request` para `main`: roda `lint`, `typecheck` e `test`
  - `push` para `main`: roda checks e, em seguida, deploy da `api` e do `admin`
  - `workflow_dispatch`: permite rerun manual controlado por servico
- deploy oficial no workflow:
  - `railway up apps/api --service foodtrucks-api-staging --environment staging --project <project_id> --path-as-root --ci`
  - `railway up apps/admin --service foodtrucks-admin-staging --environment staging --project <project_id> --path-as-root --ci`

### Secrets esperados no GitHub

- `RAILWAY_TOKEN`
  - usar Project Token de `staging`, conforme docs oficiais da Railway para CI/CD com CLI
- `RAILWAY_PROJECT_ID`
  - id do projeto `app-food-truck-staging`

### Limites desta fase

- o workflow nao cobre producao
- o workflow nao cria environments efemeros para PR
- o workflow ainda nao executa smoke tests autenticados completos apos deploy
- a validacao final do workflow depende da configuracao desses secrets no repositorio GitHub

## Manutencao do pipeline na FT-083

- ajuste local em `2026-04-05`:
  - `actions/checkout@v4` foi atualizado para `actions/checkout@v5`
  - `actions/setup-node@v4` foi atualizado para `actions/setup-node@v5`
  - `NODE_VERSION=22`, gatilhos e condicionais de deploy foram preservados
- achado da validacao remota em `2026-04-05`:
  - o warning de runtime legado continuou, agora explicitamente associado a `pnpm/action-setup@v4`
  - como nao ha `pnpm/action-setup@v5` nesta frente, o menor ajuste adicional foi remover essa action do workflow
  - o job `Verify Workspace` passou a preparar `pnpm` via `corepack enable` + `corepack prepare pnpm@10.30.3 --activate`
- falha seguinte da validacao remota em `2026-04-05`:
  - `Verify Workspace` falhou em `Setup Node.js` com `Unable to locate executable file: pnpm`
  - a causa exata foi `actions/setup-node@v5` ainda configurado com `cache: pnpm`, o que exige `pnpm` antes da ativacao via Corepack
  - o menor ajuste adicional foi remover `cache: pnpm` do `Setup Node.js`
- inspecao seguinte do YAML em `2026-04-05`:
  - nao restou `cache: pnpm`, `cache-dependency-path` ou outro uso precoce de `pnpm` antes do Corepack
  - o problema remanescente era a chamada de `pnpm` puro nos steps seguintes, ainda dependente do `PATH` entre steps
  - o ajuste minimo final foi:
    - adicionar `corepack pnpm --version` imediatamente apos `corepack prepare`
    - executar `install`, `lint`, `typecheck` e `test` como `corepack pnpm ...`
- validacao remota pendente:
  - executar o workflow `staging-ci-cd` no GitHub Actions
  - confirmar que `Verify Workspace`, `Deploy API to Staging` e `Deploy Admin to Staging` continuam saudaveis
  - confirmar que os avisos ligados ao runtime legado de Node.js 20 deixaram de aparecer
