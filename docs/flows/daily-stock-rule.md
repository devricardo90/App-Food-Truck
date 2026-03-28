# Regra de Estoque Diario

## Objetivo

Definir como o estoque do dia sera controlado no MVP para evitar venda de item sem disponibilidade real e dar a barraca um mecanismo operacional simples de controle.

## Principios

- o MVP precisa de controle simples e operacionalmente confiavel
- a disponibilidade do item deve ser refletida no cardapio, no carrinho e no checkout
- a barraca precisa de fallback manual rapido
- o produto nao depende de automacao sofisticada de estoque no primeiro corte

## Decisao principal

O MVP usa estoque diario simplificado por item.

Cada item do cardapio pode ter:

- disponibilidade ativa ou inativa
- quantidade diaria disponivel quando a barraca optar por controlar saldo

Regra do MVP:

- o controle minimo obrigatorio e a indisponibilidade manual
- saldo numerico diario pode existir como modo simples por item

## Modelo de controle do item

Cada item pode operar em um destes modos:

### 1. Disponivel sem saldo numerico

Uso:

- barraca quer controlar o item apenas manualmente

Comportamento:

- item aparece disponivel
- barraca pode desativar quando acabar

### 2. Disponivel com saldo diario

Uso:

- barraca quer limitar quantas unidades podem ser vendidas no dia

Comportamento:

- item possui quantidade diaria configurada
- cada pedido confirmado reduz o saldo do dia
- ao zerar, item fica indisponivel

### 3. Indisponivel manualmente

Uso:

- ruptura, pausa operacional ou decisao da barraca

Comportamento:

- item some do fluxo de compra ou aparece como indisponivel, conforme decisao de UX posterior
- cliente nao consegue adicionar ao carrinho

## Unidade de controle no MVP

No MVP, o controle e por item de cardapio.

Fica fora do escopo inicial:

- estoque por ingrediente
- baixa automatica por insumo
- composicao complexa multi-item
- reconciliacao fina de perdas

## Quando o saldo e consumido

Regra principal:

- o saldo diario deve ser consumido apenas quando o pedido for confirmado

Isso significa:

- `pending_payment` nao baixa estoque definitivo
- `new` baixa estoque
- cancelamento posterior pode exigir regra de devolucao operacional conforme decisao futura

No MVP, a linha mais segura e:

- pedido confirmado reduz saldo
- devolucao automatica em cancelamento posterior nao e obrigatoria no primeiro corte
- a barraca pode corrigir saldo manualmente quando necessario

## Impacto no cardapio

Se o item estiver indisponivel:

- o item nao deve ser compravel
- o cardapio deve refletir claramente a indisponibilidade

Se o item tiver saldo baixo ou zerado:

- o sistema pode sinalizar indisponibilidade
- o cliente nao deve descobrir a ruptura apenas depois do pagamento

## Impacto no carrinho

O carrinho precisa revalidar disponibilidade.

Regras:

- item adicionado anteriormente pode ficar indisponivel antes do checkout
- o carrinho deve avisar quando houver item indisponivel ou quantidade acima do saldo atual
- o cliente deve corrigir o carrinho antes de seguir

## Impacto no checkout

Antes da confirmacao final, o backend deve revalidar:

- disponibilidade do item
- saldo diario quando aplicavel

Se algum item nao estiver mais disponivel:

- o pedido nao deve ser confirmado como `new`
- o checkout deve informar claramente que o cardapio mudou

Mensagem esperada:

- um ou mais itens ficaram indisponiveis
- revise seu carrinho para continuar

## Fallback manual da barraca

O MVP precisa garantir um fallback operacional simples.

A barraca deve poder:

- marcar item como indisponivel rapidamente
- reativar item quando voltar
- ajustar saldo diario quando usar controle numerico

Esse fallback e obrigatorio porque:

- o ambiente de evento muda rapido
- o estoque pode acabar antes de qualquer automacao sofisticada reagir

## Concorrencia e protecao contra oversell

Como varios clientes podem tentar comprar o ultimo item ao mesmo tempo, o backend precisa proteger a disponibilidade real.

Regra do MVP:

- a validacao final de saldo acontece no backend
- o saldo nao pode ficar negativo por corrida evitavel
- o pedido que perder a disputa por disponibilidade nao entra em `new`

## Relacao com capacidade

Capacidade e estoque resolvem problemas diferentes:

- capacidade protege a fila operacional da barraca
- estoque protege a disponibilidade do item

Ambas as validacoes devem coexistir no checkout.

Um pedido pode falhar por:

- barraca lotada
- item indisponivel
- os dois

## Casos de erro e tratamento esperado

### 1. Item acaba depois de entrar no carrinho

Tratamento:

- carrinho ou checkout revalida
- cliente recebe aviso
- pedido nao confirma com item esgotado

### 2. Dois clientes tentam comprar a ultima unidade ao mesmo tempo

Tratamento:

- backend garante que apenas um pedido consuma o saldo final
- o outro fluxo recebe indisponibilidade e precisa revisar o carrinho

### 3. Barraca esquece de configurar saldo numerico

Tratamento:

- o sistema continua funcionando com indisponibilidade manual
- o MVP nao depende de saldo detalhado para todos os itens

### 4. Pedido cancelado apos confirmacao

Tratamento:

- ajuste automatico de retorno ao saldo nao e obrigatorio no MVP
- a barraca pode corrigir manualmente quando fizer sentido operacional

## Parametros minimos por item

Cada item pode ter pelo menos:

- `is_available`
- `daily_stock_quantity` opcional
- `daily_stock_remaining` opcional

## Impacto no backlog

- `FT-018` e `FT-019` devem refletir estados de indisponibilidade no app cliente
- `FT-021` e `FT-022` devem permitir controle basico de disponibilidade no admin da barraca
- `FT-011` deve modelar campos suficientes para disponibilidade e saldo diario simples

## Criterio de sucesso

Esta definicao esta correta quando:

- existe uma regra clara de disponibilidade diaria
- o cardapio, carrinho e checkout sabem como reagir
- o fallback manual esta previsto
- o MVP evita oversell basico sem depender de estoque sofisticado
