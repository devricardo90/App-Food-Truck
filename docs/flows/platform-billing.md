# Cobranca Mensal da Plataforma

## Objetivo

Definir como a barraca paga a mensalidade da plataforma no MVP, quais sao os status oficiais da assinatura e como isso afeta o acesso ao admin e a operacao.

## Principios

- cobranca recorrente da plataforma e separada do pagamento do pedido
- a mensalidade afeta acesso de gestao, nao o ciclo financeiro de cada pedido
- status de assinatura precisam ser simples, auditaveis e suficientes para bloquear ou liberar acesso
- o MVP deve priorizar previsibilidade operacional e evitar automacoes financeiras excessivas

## Escopo do MVP

O MVP nao exige um sistema completo de assinatura recorrente com billing sofisticado.

O que entra:

- definicao da regra oficial de cobranca mensal
- status minimos da assinatura
- relacao entre status financeiro e acesso da barraca
- regra de carencia antes de bloqueio
- previsao de upgrade futuro para recorrencia automatizada

O que fica fora:

- prorata
- cupons
- multiplos planos complexos
- split financeiro avancado
- automacao completa de retry e dunning
- gestao fiscal detalhada

## Modelo inicial de cobranca

No MVP, a plataforma trabalha com uma mensalidade por barraca ativa.

Regra base:

- cada barraca ativa possui uma assinatura operacional
- a cobranca e vinculada a barraca, nao ao operador individual
- uma mesma barraca pode ter varios usuarios, mas uma unica mensalidade vigente
- a plataforma pode iniciar com cobranca manual assistida ou recorrencia simples, desde que os mesmos status sejam respeitados

## Status oficiais da assinatura

### `trial`

Significado:

- barraca ainda esta em periodo inicial liberado
- acesso operacional e administrativo permitido

### `active`

Significado:

- mensalidade vigente e adimplente
- acesso total permitido conforme roles

### `past_due`

Significado:

- vencimento passou sem confirmacao financeira final
- barraca entra em janela de tolerancia

Regra do MVP:

- ainda pode acessar o admin por periodo curto de carencia
- plataforma deve sinalizar risco de bloqueio

### `suspended`

Significado:

- carencia expirou sem regularizacao
- acesso de gestao da barraca fica bloqueado

Regra do MVP:

- novos acessos ao admin da barraca devem ser negados
- operacoes administrativas sensiveis devem ficar indisponiveis

### `cancelled`

Significado:

- assinatura encerrada por decisao comercial ou operacional
- barraca deixa de ter acesso como operacao ativa

## Regra de vencimento e carencia

Regra base do MVP:

1. assinatura vence em data mensal definida para a barraca
2. se nao houver confirmacao financeira, status vai para `past_due`
3. a barraca entra em carencia operacional curta
4. se regularizar dentro da carencia, volta para `active`
5. se nao regularizar, vai para `suspended`

Recomendacao do MVP:

- usar carencia curta e explicita
- registrar data de vencimento, data limite de bloqueio e motivo da suspensao

## Impacto em acesso da barraca

### `trial`

- login permitido
- uso normal do admin permitido

### `active`

- login permitido
- uso normal do admin permitido

### `past_due`

- login permitido
- exibir alerta persistente de pendencia
- permitir regularizacao
- manter operacao durante a carencia

### `suspended`

- login pode continuar apenas para area de regularizacao, se a UX suportar
- acesso ao console operacional da barraca deve ficar bloqueado
- a barraca nao deve continuar usando o painel como se estivesse adimplente

### `cancelled`

- acesso operacional encerrado
- reativacao depende de nova decisao comercial ou novo ciclo de onboarding

## Relacao com roles

- `truck_operator` e `truck_manager` sofrem bloqueio de acesso quando a barraca estiver `suspended` ou `cancelled`
- `platform_admin` nunca perde acesso por status de assinatura da barraca
- `customer` nao e afetado por esse fluxo

## Regra de bloqueio

O bloqueio por assinatura inadimplente deve ocorrer no contexto da barraca.

Isso significa:

- usuario pode continuar autenticado
- mas nao pode operar recursos da barraca suspensa
- se o usuario tiver acesso a outra barraca adimplente, essa outra barraca continua acessivel

## Eventos minimos que devem ser rastreados

- assinatura criada
- data de vencimento calculada
- pagamento de mensalidade confirmado
- assinatura movida para `past_due`
- assinatura movida para `suspended`
- assinatura reativada para `active`
- assinatura cancelada

## Regras de implementacao

- assinatura da plataforma deve ser modelada separadamente do pagamento do pedido
- status da assinatura deve poder ser consultado pelo backend de auth/autorizacao
- o bloqueio deve ser aplicado antes de liberar contexto operacional da barraca
- a auditoria precisa registrar o motivo de bloqueio ou reativacao

## Caminho de evolucao

Quando o projeto evoluir para cobranca recorrente completa, o fluxo pode ganhar:

- provedor recorrente oficial
- retries automatizados
- dunning estruturado
- portal de faturamento
- historico financeiro mais completo

Mesmo assim, os status e o impacto de acesso definidos aqui devem continuar como base do dominio.
