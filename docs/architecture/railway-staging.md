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

## Variaveis obrigatorias por servico

### API

- `DATABASE_URL`
  - origem esperada: referencia ao `Postgres.DATABASE_URL` do servico de banco
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

### 5. Configurar os servicos para usar config as code

No dashboard da Railway, em cada servico:

- manter a source apontando para este repositorio
- usar config file path:
  - API: `/apps/api/railway.json`
  - Admin: `/apps/admin/railway.json`
- manter root directory em `/`

Isso preserva os comandos com `pnpm --filter ...` e evita quebrar o workspace.

### 6. Configurar variaveis

#### API

```txt
DATABASE_URL=${{foodtrucks-staging-db.DATABASE_URL}}
CLERK_SECRET_KEY=<real_secret>
CLERK_JWT_KEY=<optional_or_blank>
CLERK_JWT_TEMPLATE=<staging_template>
CLERK_AUDIENCE=<optional_or_blank>
CLERK_AUTHORIZED_PARTIES=<optional_or_blank>
```

#### Admin

```txt
API_BASE_URL=<staging_api_url>
NEXT_PUBLIC_API_BASE_URL=<staging_api_url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<staging_publishable_key>
CLERK_JWT_TEMPLATE=<staging_template>
NEXT_PUBLIC_CLERK_JWT_TEMPLATE=<staging_template>
```

### 7. Deploy inicial

Depois de linkar o projeto, cada deploy pode ser repetido por CLI:

```bash
railway service link foodtrucks-api-staging
railway up
```

```bash
railway service link foodtrucks-admin-staging
railway up
```

Se estiver operando a partir da raiz do repositorio, use o dashboard apenas para garantir que cada servico esteja apontando para o config file path correto e para a source deste repo.

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

- API staging: `PENDENTE`
- Admin staging: `PENDENTE`

## Pendencias nao bloqueantes desta fase

- pipeline CI/CD automatizada
- custom domain
- rollout de producao
- distribuicao tecnica do mobile contra o staging
