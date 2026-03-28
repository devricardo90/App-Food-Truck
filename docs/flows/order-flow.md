# Maquina de Estados do Pedido

## Objetivo

Formalizar o ciclo de vida do pedido no MVP do Foodtrucks para impedir ambiguidades entre checkout, pagamento, operacao da barraca e notificacao ao cliente.

## Principios

- pedido nao pode ser confirmado antes de pagamento valido
- estado do pedido deve ser unico e auditavel
- toda mudanca de estado precisa ter origem clara
- transicoes invalidas devem ser bloqueadas no backend
- o app e o painel exibem estado derivado do backend, nunca inventado localmente

## Estados oficiais do pedido

### `pending_payment`

Significado:

- checkout foi iniciado
- ainda nao existe confirmacao final de pagamento
- pedido ainda nao entrou na fila operacional da barraca

### `new`

Significado:

- pagamento foi confirmado
- pedido foi aceito pelo backend
- pedido entrou na fila da barraca
- barraca ja deve conseguir visualizar o pedido

### `in_progress`

Significado:

- barraca iniciou o preparo
- pedido esta em execucao operacional

### `ready`

Significado:

- preparo terminou
- pedido esta pronto para retirada
- cliente deve receber sinalizacao clara

### `completed`

Significado:

- pedido foi retirado ou encerrado operacionalmente com sucesso
- nao deve mais voltar para estados anteriores

### `cancelled`

Significado:

- pedido foi encerrado sem conclusao operacional
- precisa manter motivo auditavel

## Fluxo principal

```txt
pending_payment -> new -> in_progress -> ready -> completed
```

## Transicoes validas

### `pending_payment -> new`

Origem:

- backend apos confirmacao valida de pagamento
- normalmente disparado por webhook, callback ou confirmacao idempotente

Regra:

- so ocorre se o pagamento estiver aprovado
- cria entrada operacional para a barraca

### `pending_payment -> cancelled`

Origem:

- backend por expiracao do checkout
- backend por falha definitiva de pagamento
- usuario antes da confirmacao final, se o fluxo permitir

Regra:

- nunca gera pedido ativo para a barraca
- motivo do cancelamento deve ser registrado

### `new -> in_progress`

Origem:

- operador da barraca no painel

Regra:

- indica inicio real do preparo
- nao pode acontecer se o pedido estiver cancelado ou sem pagamento confirmado

### `new -> cancelled`

Origem:

- backend ou operador autorizado em excecao operacional

Regra:

- usar apenas quando o pedido nao puder mais ser atendido
- exige motivo auditavel
- fluxo de reembolso fica associado ao modulo de pagamento, nao a este documento

### `in_progress -> ready`

Origem:

- operador da barraca no painel

Regra:

- barraca afirma que o pedido esta pronto
- deve disparar evento de notificacao ao cliente

### `in_progress -> cancelled`

Origem:

- backend ou operador autorizado em falha operacional relevante

Regra:

- exige motivo auditavel
- deve sinalizar necessidade de tratamento financeiro se houver pagamento capturado

### `ready -> completed`

Origem:

- operador da barraca ao confirmar retirada

Regra:

- encerra o fluxo com sucesso
- estado final

### `ready -> cancelled`

Origem:

- excepcionalmente backend ou operador autorizado

Regra:

- so em anomalias reais
- exige motivo auditavel forte

## Transicoes invalidas

Estas transicoes devem ser bloqueadas:

- `pending_payment -> in_progress`
- `pending_payment -> ready`
- `pending_payment -> completed`
- `new -> ready`
- `new -> completed`
- `in_progress -> new`
- `ready -> in_progress`
- `completed -> qualquer outro estado`
- `cancelled -> qualquer outro estado`

## Origem permitida por estado

### Cliente

Pode iniciar:

- criacao do checkout que resulta em `pending_payment`
- cancelamento antes da confirmacao final, se o produto permitir

Nao pode:

- marcar pedido como `in_progress`
- marcar pedido como `ready`
- marcar pedido como `completed`

### Barraca

Pode iniciar:

- `new -> in_progress`
- `in_progress -> ready`
- `ready -> completed`
- cancelamentos excepcionais se houver permissao e motivo

Nao pode:

- confirmar pagamento
- criar pedido operacional sem backend

### Backend

Pode iniciar:

- criacao do pedido em `pending_payment`
- `pending_payment -> new` apos pagamento valido
- `pending_payment -> cancelled`
- cancelamentos sistemicos ou operacionais autorizados

Nao pode:

- inventar avancos operacionais sem evento real da barraca

## Casos de erro e tratamento esperado

### 1. Pagamento aprovado duplicadamente

Risco:

- criar dois pedidos ativos

Tratamento:

- idempotencia obrigatoria na confirmacao
- mesmo pagamento nao pode gerar dois `new`

### 2. Barraca nao recebe pedido confirmado

Risco:

- cliente pagou e pedido nao entrou em operacao

Tratamento:

- `new` so e considerado valido se persistido e rastreavel
- eventos criticos precisam de log

### 3. Operador tenta pular etapa

Risco:

- `new -> ready` ou `pending_payment -> in_progress`

Tratamento:

- backend bloqueia transicao
- painel exibe somente acoes validas para o estado atual

### 4. Cliente acha que pedido acabou, mas barraca nao confirmou retirada

Risco:

- divergencia entre percepcao do cliente e estado operacional

Tratamento:

- `completed` so apos confirmacao explicita de retirada

### 5. Cancelamento depois de pagamento capturado

Risco:

- divergencia entre estado do pedido e estado financeiro

Tratamento:

- pedido pode ir para `cancelled`
- tratamento de reembolso deve ser disparado no fluxo financeiro
- motivo precisa ficar auditavel

## Regras de implementacao

- o backend e a autoridade final da maquina de estados
- estados e transicoes devem virar constantes compartilhadas quando o monorepo existir
- logs minimos devem registrar mudanca de estado, origem, ator e timestamp
- notificacao ao cliente deve sair de eventos do backend, nao de suposicao do frontend

## Resumo operacional

Fluxo nominal:

1. cliente inicia checkout
2. backend cria `pending_payment`
3. pagamento confirma
4. backend muda para `new`
5. barraca muda para `in_progress`
6. barraca muda para `ready`
7. cliente recebe aviso
8. barraca muda para `completed`

Estados finais:

- `completed`
- `cancelled`
