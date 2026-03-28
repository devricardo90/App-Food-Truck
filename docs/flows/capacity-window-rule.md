# Regra de Capacidade por Janela de Tempo

## Objetivo

Definir a regra de capacidade por janela de tempo no MVP para evitar que a barraca aceite mais pedidos do que consegue preparar com previsibilidade operacional.

## Principios

- a capacidade precisa proteger a operacao real da barraca
- o cliente nao deve pagar por um pedido que o sistema ja sabe que nao cabe na janela atual
- a regra precisa ser simples o suficiente para o MVP
- a capacidade deve atuar como limite operacional, nao como promessa matematica perfeita

## Decisao principal

O MVP usa uma regra de capacidade por janelas curtas de tempo com limite maximo de pedidos confirmados por barraca.

Baseline recomendada para o MVP:

- janela operacional de `15 minutos`
- limite configuravel por barraca para pedidos confirmados dentro da janela

Exemplo:

- barraca A suporta `12 pedidos confirmados` a cada `15 minutos`

## O que conta na capacidade

Contam na janela:

- pedidos com pagamento confirmado que entraram em `new`
- pedidos ainda em andamento que pertencem a janela operacional considerada

Nao contam:

- `pending_payment`
- pedidos `cancelled`
- pedidos `completed` fora da janela relevante

Regra:

- a capacidade so deve ser consumida depois da confirmacao oficial do pagamento
- tentativa de checkout sem pagamento confirmado nao reserva slot de forma definitiva no MVP

## Modelo da janela

Cada barraca opera com slots sucessivos de tempo.

Exemplo conceitual:

- 12:00-12:14
- 12:15-12:29
- 12:30-12:44

Cada pedido confirmado entra na janela operacional ativa de acordo com a regra definida pela barraca ou pelo backend.

No MVP, a regra pode ser simplificada assim:

- o backend associa o pedido confirmado a uma janela de preparo estimada
- cada janela possui um contador maximo de pedidos aceitos

## Comportamento quando a janela esta disponivel

Se a janela atual tiver capacidade:

1. cliente segue no checkout
2. pagamento confirma
3. backend valida a disponibilidade da janela
4. pedido vira `new`
5. capacidade da janela e consumida

## Comportamento quando a janela esta lotada

Se a janela atual estiver lotada, o MVP deve adotar a seguinte regra:

1. checkout identifica indisponibilidade operacional antes da confirmacao final sempre que possivel
2. o sistema informa que a barraca esta sem capacidade no momento
3. o cliente nao deve receber confirmacao de pedido para a janela lotada

Regra de produto do MVP:

- o comportamento padrao e bloquear novos pedidos quando a capacidade operacional estiver esgotada
- fila de espera automatica fica fora do MVP

## Impacto no checkout

O checkout precisa refletir a capacidade operacional.

Regras:

- antes da confirmacao final, o backend deve revalidar se ainda existe capacidade
- se a capacidade esgotar entre a abertura do checkout e a confirmacao, o pedido nao deve entrar em `new`
- o frontend deve mostrar retorno claro quando a barraca estiver lotada

Mensagem esperada:

- barraca sem capacidade no momento
- tente novamente em alguns minutos

## Concorrencia e protecao contra overbooking

Como varios usuarios podem tentar pagar ao mesmo tempo, o backend precisa proteger a janela contra overbooking.

Regra do MVP:

- a decisao final de consumir capacidade acontece no backend
- a verificacao de capacidade precisa ocorrer no mesmo fluxo que confirma o pedido
- o backend nao pode aceitar dois pedidos alem do limite por condicao de corrida evitavel

## Relacao com a maquina de estados

Relacao principal:

- `pending_payment` nao ocupa capacidade definitiva
- `new` ocupa capacidade
- `cancelled` libera impacto operacional futuro quando aplicavel

Implicacao:

- a barraca so enxerga pedidos que ja passaram pela validacao de pagamento e capacidade

## Relacao com pagamento

O sistema deve evitar esta situacao:

- cliente paga
- pedido nao cabe mais na operacao

Para o MVP, a protecao minima e:

- revalidar capacidade no ponto de confirmacao
- se a capacidade falhar nesse ponto, o pedido nao entra na operacao
- qualquer tratamento financeiro necessario deve ficar auditavel

Observacao:

- a implementacao exata com provedor de pagamento depende da estrategia tecnica posterior, mas a regra de produto ja fica definida aqui

## Parametros minimos por barraca

Cada barraca deve ter pelo menos:

- `capacity_window_minutes`
- `max_orders_per_window`

Opcional futuro, fora do MVP:

- capacidade por horario do dia
- capacidade por categoria
- capacidade por item

## Comportamento operacional quando lotado

Se a barraca lotar:

- novos pedidos sao bloqueados
- cardapio pode sinalizar indisponibilidade operacional temporaria
- checkout deve impedir confirmacao enganosa

## Casos de erro e tratamento esperado

### 1. Cliente entra no checkout com capacidade ainda livre, mas outro pedido ocupa o ultimo slot antes da confirmacao

Tratamento:

- backend revalida
- pedido nao entra em `new`
- cliente recebe retorno claro de indisponibilidade operacional

### 2. Pagamento confirma, mas a janela estouraria o limite

Tratamento:

- backend deve aplicar regra de protecao para nao exceder a janela
- o fluxo financeiro precisa ficar auditavel para tratamento posterior se necessario

### 3. Barraca acelera o preparo e libera pedidos mais cedo

Tratamento:

- o MVP nao recalcula dinamicamente previsao sofisticada
- a janela continua sendo uma protecao simples de capacidade

## Impacto no backlog

- `FT-025` deve considerar esta regra junto do controle de estoque diario
- `FT-018` e `FT-019` vao precisar refletir estados de indisponibilidade no app
- `FT-021` e `FT-022` podem refletir capacidade e lotacao no admin da barraca

## Criterio de sucesso

Esta definicao esta correta quando:

- existe uma regra clara por janela
- o comportamento quando lotado esta definido
- o checkout sabe como reagir
- a operacao da barraca fica protegida contra sobrecarga evitavel
