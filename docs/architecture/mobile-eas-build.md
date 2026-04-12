# Mobile EAS Build

## Objetivo

Preparar o caminho minimo para gerar uma build Android distribuivel do app mobile contra `staging`, sem abrir producao, loja, rollout amplo, iOS ou refatoracao estrutural.

## Diagnostico atual

- O projeto mobile Expo vive em `apps/mobile`.
- Nao havia `eas.json` antes desta preparacao.
- O app ja usa variaveis `EXPO_PUBLIC_*` para API e Clerk.
- Nao ha `expo-dev-client` instalado.
- A validacao externa anterior ficou em `Expo Go` via `LAN`.
- A necessidade atual e uma build interna/controlada mais seria, sem depender de Metro em LAN.

## Decisao desta fase

Usar `preview-staging` com `distribution: internal` e Android `apk`.

Motivos:

- build interna pode ser instalada por link/arquivo em Android;
- nao exige loja;
- nao exige servidor de desenvolvimento;
- nao exige adicionar `expo-dev-client`;
- mantem foco em staging;
- reduz escopo em relacao a development build.

Development build fica fora desta primeira rodada porque exigiria instalar e validar `expo-dev-client`, alem de manter dependencia de bundler durante o uso. Essa opcao so deve voltar se houver necessidade concreta de debug nativo ou bibliotecas nativas fora do Expo Go.

## Configuracao criada

Arquivo:

```txt
apps/mobile/eas.json
```

Perfil oficial desta fase:

```txt
preview-staging
```

Ambiente EAS usado pelo perfil:

```txt
preview
```

Variaveis injetadas no build:

```txt
EXPO_PUBLIC_API_BASE_URL=https://foodtrucks-api-staging-staging.up.railway.app
EXPO_PUBLIC_CLERK_JWT_TEMPLATE=foodtrucks-api
```

Variavel que deve ser cadastrada como secret ou env de EAS antes da build:

```txt
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<publishable_key_do_tenant_de_staging>
```

Package Android desta fase:

```txt
com.foodtrucks.mobile.staging
```

Node remoto fixado para o profile:

```txt
22.12.0
```

## Pre-requisitos

1. Ter uma conta Expo com acesso ao projeto.
2. Ter EAS CLI instalado e autenticado.
3. Cadastrar `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` no ambiente do build ou informar localmente antes de executar o comando.
4. Aceitar o provisionamento de credenciais Android gerenciado pelo EAS quando a CLI solicitar.

## Comandos

Entrar no projeto mobile:

```bash
cd apps/mobile
```

Conferir login:

```bash
eas whoami
```

Se o projeto ainda nao estiver vinculado ao Expo/EAS:

```bash
eas init
```

Cadastrar a publishable key de staging como variavel remota:

```bash
eas env:create --environment preview --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value <publishable_key_do_tenant_de_staging> --visibility sensitive
```

Gerar a primeira build Android interna:

```bash
eas build --platform android --profile preview-staging
```

## Validacao apos build

1. Instalar o APK gerado pelo link do EAS em um dispositivo Android controlado.
2. Abrir o app sem Metro, sem `Expo Go` e sem `LAN`.
3. Validar login com conta de teste de staging.
4. Confirmar bootstrap autenticado via `/auth/me`.
5. Validar discovery, detalhe, catalogo e checkout minimo contra `staging`.
6. Registrar qualquer friccao em `backlog.md` antes de marcar a task como `DONE`.

## Fora de escopo

- iOS
- loja
- producao
- rollout publico
- EAS Submit
- EAS Update
- CI/CD de build mobile
- refatoracao estrutural do app

## Recomendacao operacional

O caminho minimo de EAS Build Android interno/controlado esta validado para `staging`.

Status da task: `DONE`.

Status da execucao remota: build Android interna gerada com sucesso via EAS apos a correcao de Node.

Causa raiz do bloqueio anterior:

- `prisma preinstall` rejeitou a versao de Node usada pelo builder remoto;
- evidencia do log: `Prisma only supports Node.js versions 20.19+, 22.12+, 24.0+`;
- comando remoto que falhou: `pnpm install --no-frozen-lockfile`.

Correcao minima validada:

- `node: "22.12.0"` no profile `preview-staging` de `apps/mobile/eas.json`.

Evidencia final validada:

- link/QR de distribuicao disponivel;
- app baixado no emulador Android;
- instalacao concluida com sucesso;
- app iniciado com sucesso;
- runbook validado na pratica.

Pre-requisitos para repetir a build em ciclos futuros:

- EAS CLI instalada e disponivel no shell (`eas --version`);
- login Expo validado (`eas whoami`);
- projeto vinculado ao Expo/EAS;
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` de staging cadastrada no ambiente `preview`;
- credenciais Android gerenciadas pelo EAS disponiveis para o projeto.

Nao abrir producao, loja, iOS, EAS Submit, EAS Update, CI/CD mobile ou rollout amplo a partir deste fechamento sem nova task propria no backlog canonico.
