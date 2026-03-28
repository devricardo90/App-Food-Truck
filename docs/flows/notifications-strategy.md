# Estrategia de Push e SMS

## Objetivo

Definir como o MVP do Foodtrucks vai notificar o cliente sobre eventos criticos do pedido, com foco em confiabilidade operacional e simplicidade de implementacao.

## Decisao principal

### Canal principal do MVP

O canal principal sera **push notification no app mobile**.

### SMS no MVP

**SMS fica fora do escopo do primeiro corte do MVP** como canal principal.

### Fallback do MVP

O fallback obrigatorio do MVP sera:

- status visivel e sempre atualizado dentro do app
- historico do pedido acessivel no app

Fallback opcional futuro:

- SMS para pedido pronto
- SMS para confirmacao de pedido em cenarios sem push confiavel

## Motivo da decisao

- o produto ja pressupoe app mobile autenticado
- push tem custo e integracao mais adequados ao MVP que SMS transacional
- SMS adiciona custo operacional, dependencia extra e complexidade de compliance
- o app ja precisa exibir status do pedido, entao esse caminho serve como fallback minimo
- para o primeiro corte, o risco de notificacao deve ser mitigado mais por estado confiavel no app do que por multicanal precoce

## Responsabilidade por canal

### Push

Responsavel:

- backend dispara evento de notificacao
- servico de notificacao entrega ao provedor de push
- app exibe a notificacao e reflete o estado atual ao abrir

### SMS

Responsavel no MVP:

- nao implementado como fluxo padrao

Responsavel futuro:

- backend pode acionar provedor SMS em eventos selecionados

### Estado no app

Responsavel:

- backend e autoridade do estado
- app consulta e exibe o estado atual do pedido

## Eventos que disparam notificacao no MVP

### 1. Pedido confirmado

Quando:

- pagamento foi confirmado
- pedido mudou para `new`

Canal:

- push
- fallback: estado no app

Objetivo:

- informar ao cliente que o pedido entrou na fila da barraca

### 2. Pedido pronto

Quando:

- pedido mudou para `ready`

Canal:

- push
- fallback: estado no app

Objetivo:

- avisar o cliente que pode ir retirar

## Eventos que nao exigem push obrigatorio no MVP

- `in_progress`
- `completed`
- `cancelled` em todos os cenarios

Observacao:

- esses eventos podem aparecer no app pelo estado atualizado
- `cancelled` pode virar notificacao ativa no futuro se o produto mostrar necessidade

## Regras operacionais

- push nunca substitui o estado oficial do pedido
- notificacao deve ser derivada de evento do backend, nao de suposicao do frontend
- reentrega de evento nao pode disparar duplicidade descontrolada
- abrir a notificacao deve levar o cliente ao detalhe do pedido

## Regras de backend

- backend emite evento quando o pedido entra em `new`
- backend emite evento quando o pedido entra em `ready`
- backend registra tentativa de envio
- backend registra resultado minimo de entrega quando disponivel
- backend trata idempotencia para nao disparar efeitos colaterais em duplicidade

## Regras do app

- app deve registrar token de push do dispositivo autenticado
- app deve atualizar token quando necessario
- app deve abrir o detalhe do pedido ao tocar na notificacao
- app deve sempre consultar estado atual do pedido ao abrir notificacao, em vez de confiar apenas no payload

## Fallback previsto

### Fallback obrigatorio do MVP

Se o push falhar:

- cliente ainda consegue ver status correto no app
- pedido continua rastreavel no historico
- barraca nao depende da notificacao para operar

### Fallback que fica para depois

- SMS transacional
- retry multicanal automatizado
- notificacao por email

## Casos de erro e tratamento esperado

### 1. Push nao entregue

Tratamento:

- estado continua correto no app
- cliente pode abrir o app e ver `new` ou `ready`

### 2. Push duplicado

Tratamento:

- backend precisa reduzir duplicidade via idempotencia de eventos
- app nao deve assumir mudanca nova sem consultar o backend

### 3. Token de push invalido

Tratamento:

- backend registra falha de entrega
- app atualiza token em proxima sessao valida

### 4. Cliente sem permissao de notificacao

Tratamento:

- sistema continua funcional
- app vira fallback principal

## Fora de escopo no primeiro corte

- SMS como canal obrigatorio
- automacao de fallback multicanal
- segmentacao por preferencia de notificacao
- fila avançada de retry
- dashboard detalhado de entrega de notificacao

## Criterio de sucesso

Esta estrategia esta correta quando:

- push esta definido como canal principal
- SMS esta definido como descartado no MVP inicial
- fallback esta previsto
- eventos obrigatorios estao listados
- a estrategia nao quebra a simplicidade do primeiro corte
