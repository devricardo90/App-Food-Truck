# Roles e Permissoes do MVP

## Objetivo

Definir os papeis e permissoes minimas do MVP do Foodtrucks para separar claramente cliente, operacao da barraca e gestao central, sem misturar autenticacao com autorizacao.

## Principios

- autenticacao e identidade ficam no Clerk; autorizacao pertence ao dominio
- role define capacidade de acesso, nao apenas tipo de login
- permissoes operacionais da barraca dependem de vinculo explicito com a barraca
- gestao central nao se mistura com operacao normal da barraca por padrao
- o backend e a autoridade final de permissao

## Modelo de autorizacao do MVP

O MVP usa dois niveis de contexto:

1. role principal do usuario no dominio
2. vinculo do usuario com uma barraca quando aplicavel

Regra:

- sem role valida, o usuario autenticado nao recebe acesso operacional
- sem vinculo valido com barraca, o usuario nao opera dados da barraca
- o cliente comum nao recebe acesso ao admin

## Roles oficiais do MVP

### 1. `customer`

Perfil:

- usuario final que compra no app

Escopo:

- somente experiencia do cliente

Pode:

- autenticar no app cliente
- consultar barracas e cardapios
- montar carrinho
- iniciar checkout
- consultar os proprios pedidos
- acompanhar status do proprio pedido

Nao pode:

- acessar painel admin
- alterar cardapio
- operar pedidos de barraca
- ver pedidos de outros usuarios
- gerenciar acessos

### 2. `truck_operator`

Perfil:

- membro da equipe da barraca focado em operacao diaria

Escopo:

- somente a barraca a qual esta vinculado

Pode:

- acessar painel autenticado da propria barraca
- visualizar pedidos da propria barraca
- mudar status de pedido dentro das transicoes validas
- marcar item como indisponivel quando a politica do produto permitir

Nao pode:

- acessar dados de outra barraca
- gerenciar membros da barraca
- alterar configuracoes centrais da plataforma
- acessar visao de gestao central

### 3. `truck_manager`

Perfil:

- responsavel operacional/administrativo de uma barraca

Escopo:

- somente a barraca a qual esta vinculado

Pode:

- tudo que `truck_operator` pode
- gerenciar cardapio basico da propria barraca
- gerenciar disponibilidade operacional da propria barraca
- consultar configuracoes basicas da propria barraca
- gerenciar membros da propria barraca quando essa funcionalidade existir no MVP

Nao pode:

- acessar dados de outra barraca
- administrar a plataforma inteira
- alterar regras globais do produto

### 4. `platform_admin`

Perfil:

- gestao central da plataforma

Escopo:

- visao transversal da operacao

Pode:

- acessar area central do admin
- visualizar barracas, usuarios vinculados e estado operacional geral
- gerenciar cadastro e vinculacao de barracas
- gerenciar papeis e acessos administrativos da plataforma
- apoiar suporte operacional quando necessario

Nao pode por padrao:

- operar fluxo cotidiano de uma barraca como se fosse membro dela sem acao explicita prevista pelo produto
- agir fora das regras auditaveis do backend

## Role minima recomendada para o MVP

Roles minimas obrigatorias:

- `customer`
- `truck_operator`
- `truck_manager`
- `platform_admin`

Esta linha minimiza ambiguidade e ja separa:

- cliente
- operacao da barraca
- administracao da barraca
- gestao central

## Matriz minima de permissoes

| Capacidade | customer | truck_operator | truck_manager | platform_admin |
| --- | --- | --- | --- | --- |
| Login no app cliente | sim | opcional | opcional | opcional |
| Login no admin | nao | sim | sim | sim |
| Ver barracas e cardapios publicos | sim | sim | sim | sim |
| Criar e pagar pedido proprio | sim | nao | nao | nao |
| Ver proprio historico de pedidos | sim | nao | nao | nao |
| Ver pedidos da barraca vinculada | nao | sim | sim | visao central |
| Mudar status do pedido da barraca vinculada | nao | sim | sim | suporte controlado |
| Alterar disponibilidade de item na barraca | nao | sim | sim | nao por padrao |
| Editar cardapio da barraca | nao | nao | sim | nao por padrao |
| Gerenciar membros da barraca | nao | nao | sim | sim |
| Gerenciar barracas da plataforma | nao | nao | nao | sim |
| Gerenciar roles centrais | nao | nao | nao | sim |
| Ver visao consolidada da operacao | nao | nao | limitado a propria barraca | sim |

## Regras de escopo por area

### App cliente

- role efetiva esperada: `customer`
- acesso restrito aos dados do proprio usuario
- qualquer tela administrativa deve ser bloqueada

### Painel da barraca

- roles efetivas esperadas: `truck_operator` ou `truck_manager`
- dados sempre filtrados pela barraca vinculada
- usuario autenticado sem vinculo valido nao entra na area operacional

### Painel central

- role efetiva esperada: `platform_admin`
- acesso a visao transversal e governanca
- separacao visual e funcional entre area central e area da barraca deve ser mantida

## Modelo de vinculo com barraca

Para roles operacionais, o usuario precisa ter:

- `role`: `truck_operator` ou `truck_manager`
- `truck_id` valido no dominio local

Regra:

- a role sozinha nao basta
- o vinculo com barraca precisa existir e estar ativo
- um mesmo usuario pode, no futuro, ter mais de um vinculo; no MVP basta suportar um vinculo ativo por contexto

## Regras de autorizacao no backend

- toda rota autenticada deve resolver `user_id`, `role` e contexto de vinculacao
- roles devem ser validadas no backend, nunca apenas escondidas no frontend
- transicoes de pedido continuam obedecendo a maquina de estados oficial
- `platform_admin` deve atuar com rastreabilidade quando acessa fluxo operacional sensivel

## Casos que devem ser bloqueados

- usuario autenticado sem role de dominio tentando entrar no admin
- `truck_operator` tentando acessar dados de outra barraca
- `truck_manager` tentando administrar a plataforma
- `customer` tentando consumir endpoints operacionais
- usuario com token valido, mas sem vinculo exigido, tentando operar pedidos

## Impacto no backlog

- `FT-016` deve implementar guards e resolucao de contexto usando esta matriz
- `FT-007` deve considerar que o cliente nao possui acoes administrativas
- `FT-008` deve separar visao da barraca e visao central desde o mapa inicial de telas

## Criterio de sucesso

Esta definicao esta correta quando:

- as roles minimas do MVP estao claras
- existe separacao explicita entre barraca e gestao central
- o backend consegue derivar regras objetivas de autorizacao
- o produto nao depende de interpretacao informal para decidir quem pode fazer o que
