# Estrategia Minima de Logs e Rastreabilidade

## Objetivo

Definir os logs minimos do MVP para que pedido, pagamento e notificacao possam ser investigados sem depender de memoria, suposicao ou acesso direto a banco como primeira linha de suporte.

## Principios

- logs devem servir suporte e operacao, nao ruido excessivo
- cada evento critico precisa ser rastreavel por identificadores estaveis
- o backend e a fonte principal de rastreabilidade do fluxo
- log sem contexto suficiente nao resolve incidente real

## Escopo da estrategia

Esta estrategia define:

- eventos criticos que precisam de log
- identificadores minimos de rastreio
- campos minimos por tipo de evento

Esta estrategia nao define:

- stack de observabilidade final
- dashboard final
- retencao formal de longo prazo

## Identificadores minimos de rastreio

Todo fluxo critico deve usar pelo menos estes identificadores quando aplicavel:

- `order_id`
- `payment_id`
- `provider_payment_id`
- `user_id`
- `truck_id`
- `role`
- `event_name`
- `timestamp`
- `request_id` ou equivalente de correlacao

## Regra geral de correlacao

Sempre que possivel:

- um pedido deve ser rastreavel do checkout ao `completed` ou `cancelled`
- um pagamento deve ser rastreavel da criacao ao `paid`, `failed`, `cancelled` ou `refunded`
- uma notificacao deve ser rastreavel do disparo ao resultado minimo de entrega

## Eventos criticos obrigatorios

### 1. Criacao de checkout / pedido em `pending_payment`

Log minimo:

- `event_name`: `order.pending_payment.created`
- `order_id`
- `user_id`
- `truck_id`
- valor resumido do pedido quando aplicavel
- `request_id`
- timestamp

### 2. Confirmacao de pagamento

Log minimo:

- `event_name`: `payment.paid`
- `payment_id`
- `provider_payment_id`
- `order_id`
- `user_id`
- valor pago
- origem do evento
- `request_id`
- timestamp

### 3. Falha ou cancelamento de pagamento

Log minimo:

- `event_name`: `payment.failed` ou `payment.cancelled`
- `payment_id`
- `provider_payment_id` quando existir
- `order_id`
- motivo resumido
- origem do evento
- `request_id`
- timestamp

### 4. Mudanca de estado do pedido

Log minimo:

- `event_name`: `order.status.changed`
- `order_id`
- estado anterior
- novo estado
- ator responsavel
- `user_id` quando aplicavel
- `truck_id`
- `request_id`
- timestamp

### 5. Bloqueio por capacidade

Log minimo:

- `event_name`: `order.capacity.blocked`
- `order_id` quando ja existir
- `truck_id`
- janela operacional
- limite da janela
- ocupacao no momento
- `request_id`
- timestamp

### 6. Bloqueio por estoque / indisponibilidade

Log minimo:

- `event_name`: `order.stock.blocked`
- `order_id` quando ja existir
- `truck_id`
- item afetado
- quantidade solicitada
- disponibilidade atual
- `request_id`
- timestamp

### 7. Disparo de notificacao

Log minimo:

- `event_name`: `notification.dispatch.requested`
- `order_id`
- tipo da notificacao
- canal
- destinatario logico
- `request_id`
- timestamp

### 8. Resultado de notificacao

Log minimo:

- `event_name`: `notification.dispatch.result`
- `order_id`
- tipo da notificacao
- canal
- resultado
- codigo resumido quando houver
- `request_id`
- timestamp

### 9. Falha de autorizacao

Log minimo:

- `event_name`: `auth.authorization.denied`
- `user_id` quando resolvido
- `role`
- recurso ou area acessada
- motivo resumido
- `request_id`
- timestamp

## Campos minimos por categoria

### Pedido

- `order_id`
- `truck_id`
- `user_id`
- estado
- ator
- timestamp

### Pagamento

- `payment_id`
- `provider_payment_id` quando existir
- `order_id`
- status
- valor
- origem do evento
- timestamp

### Notificacao

- `order_id`
- canal
- tipo
- resultado
- timestamp

### Autorizacao

- `user_id`
- `role`
- recurso
- decisao
- timestamp

## Niveis minimos de log do MVP

### `info`

Usar para:

- eventos criticos nominais do fluxo
- mudancas importantes de estado

### `warn`

Usar para:

- bloqueios operacionais esperados mas relevantes
- falhas de autorizacao
- falha de entrega de notificacao

### `error`

Usar para:

- quebra inesperada do fluxo
- falha de integracao relevante
- inconsistencia que impede continuidade segura

## O que deve ser evitado

- logar segredo, token ou dado sensivel bruto
- logar payload completo sem necessidade
- gerar ruido em excesso para eventos sem valor operacional
- depender apenas de mensagem solta sem identificadores

## Consultas operacionais que os logs devem responder

Antes de staging e no MVP, os logs precisam permitir responder:

1. cliente pagou? quando?
2. o pedido virou `new`? quando?
3. quem mudou o pedido para `in_progress`, `ready` ou `completed`?
4. o pedido foi bloqueado por capacidade ou estoque?
5. a notificacao de pedido pronto foi disparada?
6. houve falha de autorizacao ou acesso indevido?

## Relacao com suporte

Para suporte minimo, um incidente deve poder ser investigado com:

- `order_id`
- `payment_id` ou `provider_payment_id`
- linha do tempo de eventos principais
- ultimo estado conhecido do pedido

## Impacto no backlog

- `FT-009` em diante deve incluir estes logs nas rotas e servicos criticos
- `FT-026`, `FT-028`, `FT-024` e `FT-025` ja definiram eventos que precisam aparecer nessa trilha
- futuras tasks de observabilidade podem evoluir essa base para dashboards e alertas

## Criterio de sucesso

Esta estrategia esta correta quando:

- os eventos criticos estao listados
- os identificadores de rastreio estao definidos
- existe log minimo por fluxo
- suporte consegue investigar o caminho pedido -> pagamento -> notificacao sem depender de memoria
