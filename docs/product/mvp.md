# MVP Foodtrucks

## Objetivo

Definir o escopo oficial do MVP da plataforma Foodtrucks para eventos, com foco em um fluxo de pedido confiavel, operacao simples para a barraca e base suficiente para crescer sem retrabalho imediato.

## Problema que o MVP resolve

O MVP existe para permitir que um cliente faca um pedido em um evento, pague com seguranca, acompanhe o status e retire no ponto correto, enquanto a barraca opera pedidos de forma clara, rapida e sem perder controle de fila, disponibilidade e confirmacao.

## Personas principais

### 1. Cliente do evento

Perfil:

- esta em pe
- tem pressa
- usa celular no contexto do evento
- quer comprar com poucos toques

Necessidades:

- descobrir barracas participantes
- ver cardapio rapidamente
- montar carrinho
- pagar sem friccao
- acompanhar status do pedido
- ser avisado quando estiver pronto

### 2. Operador da barraca

Perfil:

- trabalha sob alta demanda
- precisa de leitura rapida
- nao pode perder tempo com interface complexa

Necessidades:

- receber pedidos em tempo real
- visualizar fila de preparo
- atualizar status com poucos cliques
- controlar disponibilidade de itens
- reduzir erro operacional

### 3. Gestao central da plataforma

Perfil:

- acompanha operacao de varias barracas e eventos
- precisa de visibilidade e controle

Necessidades:

- cadastrar e organizar barracas
- monitorar operacao
- gerenciar acessos
- acompanhar estado geral da plataforma

## Modulos que entram no MVP

### Cliente

- autenticacao basica
- lista de barracas do evento
- visualizacao de cardapio
- carrinho
- checkout
- acompanhamento de status do pedido
- historico basico de pedidos
- notificacao de pedido confirmado e pedido pronto

### Barraca

- login
- painel de pedidos em tempo real
- atualizacao de status do pedido
- gestao basica de cardapio
- controle manual de disponibilidade

### Plataforma

- cadastro e gestao basica de barracas
- gestao basica de usuarios e papeis
- visibilidade operacional minima

### Backend e dominio

- API central para pedidos, usuarios, barracas, menus e pagamentos
- persistencia com historico minimo de pedido e pagamento
- controle de transicoes de status do pedido
- integracao de pagamento com confirmacao segura
- rastreabilidade minima para suporte

## Fluxos obrigatorios do MVP

### Fluxo 1 - Pedido

1. cliente escolhe barraca
2. cliente seleciona itens
3. cliente revisa carrinho
4. cliente inicia checkout
5. pagamento e confirmado
6. pedido nasce no sistema
7. barraca recebe pedido
8. barraca move pedido para preparo
9. barraca marca pedido como pronto
10. cliente recebe notificacao
11. cliente retira pedido

### Fluxo 2 - Operacao da barraca

1. operador entra no painel
2. novos pedidos aparecem sem atraso relevante
3. operador enxerga fila por status
4. operador atualiza estado com poucos cliques
5. operador controla indisponibilidade de item quando necessario

### Fluxo 3 - Suporte e rastreio

1. pedido possui identificador claro
2. pagamento possui relacao clara com pedido
3. eventos criticos ficam rastreaveis
4. equipe consegue investigar falha sem depender de memoria

## O que fica fora do escopo do MVP

- programa de fidelidade
- recomendacao personalizada
- marketplace multi-evento sofisticado
- roteamento logistico de entrega
- split de pagamento complexo
- promocoes avancadas e motor de cupons completo
- relatorios financeiros avancados
- automacao de estoque sofisticada
- BI completo
- chat em tempo real com cliente
- suporte omnichannel
- dark kitchen ou multi-operacao complexa
- cobranca recorrente completa da plataforma

## Regras de produto do MVP

- pedido so pode ser confirmado depois de pagamento valido
- status do pedido deve ser explicito e rastreavel
- a barraca nunca pode operar no escuro
- o cliente deve receber feedback imediato nas etapas criticas
- o painel da barraca deve priorizar velocidade operacional
- simplicidade vale mais que cobertura excessiva de edge cases no primeiro corte

## Riscos operacionais anotados

### 1. Falha no elo pagamento -> pedido

Impacto:

- cliente paga e pedido nao aparece

Mitigacao no MVP:

- modelar relacao pagamento-pedido com idempotencia
- logs minimos por evento critico
- regra clara de confirmacao

### 2. Barraca sobrecarregada

Impacto:

- fila cresce alem da capacidade real

Mitigacao no MVP:

- preparar regra de capacidade por janela
- permitir indisponibilidade manual de itens
- evitar promessa operacional irreal

### 3. Notificacao falhar

Impacto:

- cliente nao sabe que pedido esta pronto

Mitigacao no MVP:

- manter status visivel no app
- definir fallback minimo para notificacao

### 4. Escopo crescer cedo demais

Impacto:

- atraso, retrabalho e sistema inconsistente

Mitigacao no MVP:

- separar claramente MVP de futuro
- priorizar fluxo critico antes de refinamentos

## Criterio de sucesso do MVP

O MVP esta correto quando:

- o cliente consegue pedir, pagar e retirar sem ambiguidade
- a barraca consegue operar pedidos com clareza
- o sistema nao confirma pedido sem pagamento
- status do pedido e do pagamento sao auditaveis
- a base documental sustenta as proximas tarefas do backlog
