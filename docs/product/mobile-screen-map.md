# Mapa Inicial de Telas do Mobile

## Objetivo

Definir o conjunto inicial de telas do app cliente do MVP, sua navegacao principal e os estados minimos necessarios para sustentar o fluxo de pedido sem ambiguidade.

## Principios

- o app deve privilegiar descoberta rapida, pedido claro e acompanhamento confiavel
- a navegacao deve reduzir passos entre barraca, cardapio, carrinho e checkout
- status do pedido precisa ser acessivel mesmo quando a notificacao falhar
- o cliente nao possui acoes administrativas no app

## Escopo do mapa

Este documento cobre:

- telas essenciais do app cliente
- fluxo principal de navegacao
- estados vazios e de erro prioritarios

Este documento nao cobre:

- layout visual detalhado
- copy final
- design system
- variacoes futuras fora do MVP

## Estrutura principal de navegacao

No MVP, o app pode ser organizado em quatro areas principais:

1. autenticacao
2. descoberta
3. pedido
4. historico e conta

## Telas essenciais

### 1. Splash / Bootstrap

Objetivo:

- resolver sessao
- carregar contexto inicial
- decidir para onde o usuario segue

Acoes principais:

- verificar autenticacao
- preparar estado inicial

Saidas:

- login
- home de barracas

### 2. Login / Cadastro

Objetivo:

- autenticar cliente via Clerk

Acoes principais:

- entrar
- cadastrar
- recuperar acesso conforme fluxo do provider

Observacao:

- esta tela pertence apenas ao contexto do cliente
- nenhuma acao administrativa existe aqui

### 3. Home de Barracas

Objetivo:

- permitir descoberta rapida das barracas disponiveis no evento

Acoes principais:

- ver lista de barracas
- buscar ou filtrar quando aplicavel no MVP
- entrar em uma barraca

Dados esperados:

- nome da barraca
- categoria resumida
- status basico de disponibilidade

### 4. Detalhe da Barraca

Objetivo:

- apresentar contexto da barraca e entrada para o cardapio

Acoes principais:

- ver informacoes resumidas da barraca
- entrar no cardapio
- entender se a barraca esta aceitando pedidos

### 5. Cardapio

Objetivo:

- listar itens disponiveis e permitir composicao do pedido

Acoes principais:

- navegar por categorias
- abrir detalhe do item
- adicionar item ao carrinho

Dados esperados:

- nome
- preco
- descricao curta
- disponibilidade

### 6. Detalhe do Item

Objetivo:

- dar contexto suficiente para decidir a compra

Acoes principais:

- ver descricao completa
- ajustar quantidade quando aplicavel
- adicionar ao carrinho

### 7. Carrinho

Objetivo:

- revisar os itens antes do checkout

Acoes principais:

- alterar quantidade
- remover item
- revisar subtotal
- seguir para checkout

Regra:

- o carrinho deve manter referencia clara da barraca ativa
- o MVP nao deve misturar itens de barracas diferentes no mesmo carrinho

### 8. Checkout

Objetivo:

- confirmar os dados finais da compra e iniciar pagamento

Acoes principais:

- revisar pedido
- confirmar dados necessarios
- iniciar pagamento

Regra:

- a tela pode mostrar progresso, mas nao confirma pedido como aceito antes do backend validar pagamento

### 9. Pagamento em andamento

Objetivo:

- acompanhar o estado intermediario entre inicio do pagamento e confirmacao oficial

Acoes principais:

- informar que o sistema aguarda retorno oficial
- permitir reconsulta de estado

Regra:

- o frontend nao promove o pedido para confirmado por conta propria

### 10. Pedido Confirmado / Acompanhamento

Objetivo:

- mostrar que o pedido existe e acompanhar seus estados

Acoes principais:

- visualizar identificador do pedido
- visualizar estado atual
- entender proximo passo esperado

Estados relevantes para exibicao:

- `pending_payment`
- `new`
- `in_progress`
- `ready`
- `completed`
- `cancelled`

### 11. Detalhe do Pedido

Objetivo:

- aprofundar informacoes de um pedido especifico

Acoes principais:

- ver itens comprados
- ver linha do tempo resumida
- ver status atual

### 12. Historico de Pedidos

Objetivo:

- permitir que o cliente consulte pedidos anteriores

Acoes principais:

- listar pedidos anteriores
- entrar no detalhe do pedido

### 13. Conta / Perfil

Objetivo:

- concentrar configuracoes simples do cliente

Acoes principais:

- ver dados basicos
- sair da conta

## Fluxo principal de navegacao

```txt
Splash
  -> Login/Cadastro
  -> Home de Barracas

Home de Barracas
  -> Detalhe da Barraca
  -> Historico de Pedidos
  -> Conta

Detalhe da Barraca
  -> Cardapio

Cardapio
  -> Detalhe do Item
  -> Carrinho

Carrinho
  -> Checkout

Checkout
  -> Pagamento em andamento

Pagamento em andamento
  -> Pedido Confirmado/Acompanhamento
  -> Carrinho

Historico de Pedidos
  -> Detalhe do Pedido
```

## Estados vazios prioritarios

### Home sem barracas

Quando usar:

- nao ha barracas disponiveis no contexto atual

Mensagem esperada:

- evento sem barracas disponiveis no momento

### Cardapio vazio

Quando usar:

- barraca sem itens disponiveis

Mensagem esperada:

- barraca sem itens disponiveis agora

### Historico vazio

Quando usar:

- cliente ainda nao fez pedidos

Mensagem esperada:

- nenhum pedido realizado ate agora

### Carrinho vazio

Quando usar:

- cliente removeu todos os itens

Mensagem esperada:

- carrinho sem itens e CTA para voltar ao cardapio

## Estados de erro prioritarios

### Falha ao carregar barracas

Tratamento:

- mostrar erro curto
- permitir tentar novamente

### Falha ao carregar cardapio

Tratamento:

- mostrar erro curto
- manter contexto da barraca
- permitir recarregar

### Item indisponivel ao adicionar ou revisar carrinho

Tratamento:

- avisar indisponibilidade
- atualizar o carrinho sem ambiguidade

### Pagamento sem confirmacao imediata

Tratamento:

- manter estado intermediario claro
- orientar o usuario a aguardar confirmacao oficial
- permitir reconsulta do pedido

### Pedido cancelado ou falha definitiva

Tratamento:

- informar resultado claramente
- orientar proximo passo possivel

## Regras de navegacao importantes

- o carrinho deve estar sempre associado a uma unica barraca por vez
- a rota de acompanhamento do pedido precisa ser acessivel pelo app mesmo apos fechar a tela de pagamento
- o historico deve servir como fallback quando a notificacao nao resolver a jornada
- telas do cliente nao devem expor acoes de barraca ou gestao central

## Impacto no backlog

- `FT-019` deve usar este mapa para estruturar rotas base do app cliente
- `FT-018` deve preparar navegacao suficiente para sustentar este fluxo
- `FT-024` e `FT-025` vao influenciar estados de disponibilidade e checkout

## Criterio de sucesso

Este mapa esta correto quando:

- as telas essenciais do cliente estao listadas
- a navegacao principal sustenta o fluxo de pedido do MVP
- estados vazios e de erro relevantes estao previstos
- o app nao depende de interpretacao informal para definir o percurso do cliente
