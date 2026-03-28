# Monorepo Architecture

## Objetivo

Definir a estrutura inicial do monorepo do Foodtrucks para separar responsabilidades, facilitar reuso e permitir evolucao paralela entre mobile, admin e API sem perder coerencia tecnica.

## Estrutura oficial

```txt
apps/
  admin/
  api/
  mobile/

packages/
  api-client/
  config/
  schemas/
  types/
  utils/
```

## Responsabilidade por app

### `apps/mobile`

Responsavel pelo app do cliente.

Escopo esperado:

- autenticacao mobile
- descoberta de barracas
- cardapio
- carrinho
- checkout
- acompanhamento de pedido
- notificacoes ao cliente

### `apps/admin`

Responsavel pelo painel web.

Escopo esperado:

- area da barraca
- area central da plataforma
- operacao de pedidos
- gestao basica de cardapio
- setup operacional
- gestao de acessos e visibilidade

### `apps/api`

Responsavel pelo backend central.

Escopo esperado:

- dominio de pedidos
- autenticacao e autorizacao
- integracao com pagamentos
- notificacoes
- persistencia
- documentacao OpenAPI
- Swagger e Scalar

## Responsabilidade por package

### `packages/types`

Tipos compartilhados entre apps e backend.

### `packages/schemas`

Schemas reutilizaveis para validacao e contratos compartilhados.

### `packages/utils`

Funcoes utilitarias sem acoplamento a runtime especifico.

### `packages/config`

Configuracoes compartilhadas de tooling, ambiente e runtime quando fizer sentido.

### `packages/api-client`

Cliente compartilhado para consumo da API pelos frontends.

## Principios da organizacao

- cada app deve manter sua responsabilidade principal
- compartilhar apenas o que reduz duplicacao real
- evitar dependencia cruzada entre apps
- mover logica transversal para `packages` quando houver reuso claro
- backend continua sendo a autoridade de regra de negocio

## Regras de dependencia

- apps podem consumir `packages`
- `packages` nao devem depender de apps
- `packages` devem evitar acoplamento desnecessario com frameworks
- contratos compartilhados precisam refletir a documentacao oficial do backend

## Tooling compartilhado

A base do workspace usa:

- `pnpm-workspace.yaml` para definir o workspace
- `turbo.json` para orquestrar tarefas
- `tsconfig.base.json` para TypeScript compartilhado
- `eslint.config.mjs` e `prettier.config.cjs` para qualidade e formatacao
- `.gitignore` da raiz como unica fonte oficial de regras de ignore

## Regra de ignore do monorepo

- cada app deve obedecer ao `.gitignore` da raiz
- apps nao devem manter `.gitignore` proprio sem task e decisao arquitetural explicitas
- `apps/mobile/expo-env.d.ts` permanece versionado por fazer parte do setup do app Expo
- arquivos gerados locais do Expo continuam sendo tratados pela regra da raiz, sem duplicacao em `apps/mobile/.gitignore`

## Ordem estrutural das proximas etapas

1. consolidar docs minimas e regras do projeto
2. criar base do backend
3. criar base do mobile
4. criar base do admin
5. conectar contratos compartilhados conforme o dominio surgir

## Limites importantes

- nao usar este documento para redefinir regras de produto; isso vive em `docs/product`
- nao duplicar a maquina de estados do pedido aqui; isso vive em `docs/flows/order-flow.md`
- versoes oficiais nao vivem aqui; isso vive em `docs/architecture/version-matrix.md`
