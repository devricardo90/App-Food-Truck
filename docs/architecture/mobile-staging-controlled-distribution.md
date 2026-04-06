# Distribuicao Controlada do Mobile em Staging

## Objetivo

Formalizar o menor caminho oficial para executar o app mobile contra o `staging` fora do ambiente interno de emulador, sem abrir rollout publico, sem loja e sem frente estrutural ampla.

Esta fase existe para permitir validacao externa limitada com poucos testadores em dispositivo real, usando o baseline remoto do MVP ja comprovado em `staging`.

## Canal oficial desta fase

- canal: `Expo Go`
- modo oficial: `LAN`
- publico alvo:
  - owner do projeto
  - 1 a 3 validadores controlados
  - todos previamente alinhados sobre o fato de que o app aponta para `staging`

## Motivo da escolha

- o repositório atual nao possui trilha `EAS Build`, distribuicao interna versionada nem pipeline de release mobile prontos
- o canal `Expo Go` permite validar instalacao/acesso e runtime em dispositivo real com o menor custo operacional desta fase
- o modo `LAN` evita ampliar o escopo para release nativa, assinatura ou loja

## Fora de escopo desta fase

- publicacao em App Store ou Google Play
- rollout amplo
- producao
- pipeline completa de release mobile
- build nativa distribuida por `EAS` ou equivalente

## Configuracao oficial para staging

Antes de iniciar o servidor do mobile, o ambiente deve apontar explicitamente para o `staging`:

```txt
EXPO_PUBLIC_API_BASE_URL=https://foodtrucks-api-staging-staging.up.railway.app
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<publishable_key_atual_do_tenant>
EXPO_PUBLIC_CLERK_JWT_TEMPLATE=foodtrucks-api
```

## Comando oficial

No estado atual do projeto, o comando oficial fica:

```bash
pnpm --filter @foodtrucks/mobile exec expo start --lan --go --clear --port 8085
```

## Pre-condicoes para o testador

1. Instalar `Expo Go` no dispositivo real.
2. Colocar o dispositivo na mesma rede local do operador que iniciou o servidor.
3. Confirmar que o staging esta saudavel:
   - `GET /health = 200`
   - `GET /docs = 200`
4. Usar conta de teste controlada e nao conta de producao.

## Endereco operacional desta rodada

- host local do operador: `172.20.10.5`
- porta do Metro/LAN: `8085`
- acesso esperado no dispositivo real:

```txt
exp://172.20.10.5:8085
```

## Checklist curto de validacao externa

1. Abrir o app no `Expo Go`.
2. Confirmar que a home do app carrega sem crash.
3. Validar login/autenticacao com a conta de teste.
4. Confirmar bootstrap autenticado via `/auth/me`.
5. Validar discovery, detalhe e catalogo de `funky-chicken`.
6. Executar o fluxo principal de checkout ate criacao do pedido.
7. Registrar qualquer friccao de:
   - sessao
   - rede
   - atualizacao
   - permissao
   - runtime
   - estabilidade

## Evidencia objetiva desta rodada

- em `2026-04-06`, o canal `Expo Go` em modo `LAN` subiu com sucesso no projeto mobile
- o servidor local ficou aguardando em `http://localhost:8085`
- o bundle web respondeu com sucesso quando consultado localmente, confirmando que o app foi servido com o nome `Foodtrucks Mobile`
- a configuracao usada nesta rodada apontou explicitamente para a API publica de `staging`

## Friccoes reais observadas

### 1. `tunnel` indisponivel nesta rodada

- a tentativa de subir `expo start --tunnel --go --clear --port 8085` falhou com `failed to start tunnel`
- detalhe observado: `remote gone away`
- leitura operacional:
  - o bloqueio ficou na dependencia externa do tunel (`ngrok`)
  - nao houve evidencia de falha estrutural do app mobile, do `staging` ou do contrato de auth

### 2. Canal externo desta fase ficou restrito a `LAN`

- por causa da indisponibilidade do `tunnel`, o primeiro canal oficial utilizavel ficou limitado a dispositivos na mesma rede local
- isso continua sendo suficiente para validacao externa controlada de baixa escala
- nao e suficiente para rollout amplo nem para validadores remotos fora da rede

## Leitura operacional

- o canal controlado desta fase ficou formalizado e utilizavel
- a principal limitacao nao e do app, e sim do meio de distribuicao `tunnel`
- se a equipe precisar sair da mesma rede local, essa necessidade deve voltar em task propria, sem misturar com producao
