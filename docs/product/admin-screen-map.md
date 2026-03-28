# Mapa Inicial de Telas do Admin

## Objetivo

Definir o mapa inicial de telas do admin do MVP, separando claramente a area operacional da barraca da area central da plataforma.

## Principios

- o admin nao e uma experiencia unica; ele possui dois contextos distintos
- a area da barraca prioriza operacao e rapidez
- a area central prioriza governanca, visibilidade e suporte
- roles e vinculos precisam refletir essa separacao na navegacao

## Escopo do mapa

Este documento cobre:

- telas iniciais da area da barraca
- telas iniciais da area central
- navegacao principal
- estados vazios e de erro prioritarios

Este documento nao cobre:

- layout visual final
- permissao por endpoint
- detalhes de implementacao do app Next

## Contextos do admin

### Area da barraca

Roles esperadas:

- `truck_operator`
- `truck_manager`

Objetivo:

- operar pedidos e administrar o basico da barraca

### Area central

Role esperada:

- `platform_admin`

Objetivo:

- governar barracas, acessos e visao operacional geral

## Estrutura principal de navegacao

No MVP, o admin pode ser organizado assim:

1. autenticacao
2. area da barraca
3. area central

Regra:

- o usuario deve cair apenas no contexto permitido pela sua role e pelo seu vinculo
- a navegacao da barraca e a navegacao central nao devem se misturar por padrao

## Telas essenciais da area da barraca

### 1. Login / Entrada autenticada

Objetivo:

- autenticar operador ou gerente da barraca

Acoes principais:

- entrar
- validar sessao
- redirecionar para a area permitida

### 2. Dashboard da Barraca

Objetivo:

- dar visao operacional rapida da barraca

Acoes principais:

- ver contagem de pedidos por estado
- ver alertas operacionais
- navegar para pedidos e cardapio

Dados esperados:

- novos pedidos
- pedidos em preparo
- pedidos prontos
- disponibilidade operacional resumida

### 3. Lista de Pedidos da Barraca

Objetivo:

- concentrar a fila operacional da barraca

Acoes principais:

- filtrar por estado
- abrir detalhe do pedido
- executar acoes validas para o estado atual

### 4. Detalhe do Pedido da Barraca

Objetivo:

- operar um pedido especifico sem ambiguidade

Acoes principais:

- ver itens do pedido
- ver identificador e horario
- iniciar preparo
- marcar pronto
- confirmar retirada
- registrar cancelamento excepcional quando permitido

Regra:

- as acoes devem respeitar a maquina de estados oficial

### 5. Cardapio da Barraca

Objetivo:

- gerenciar o cardapio basico da propria barraca

Acoes principais:

- listar itens
- abrir detalhe do item
- editar disponibilidade
- editar informacoes basicas quando a role permitir

### 6. Detalhe / Edicao de Item da Barraca

Objetivo:

- ajustar dados operacionais de item

Acoes principais:

- editar nome, descricao curta e preco quando aplicavel
- marcar indisponivel
- reativar item

Regra:

- `truck_operator` pode ter permissao limitada
- `truck_manager` concentra as acoes administrativas da barraca

### 7. Configuracoes Basicas da Barraca

Objetivo:

- exibir informacoes basicas e controles locais da barraca

Acoes principais:

- ver dados da barraca
- revisar disponibilidade operacional
- acessar membros da barraca quando a funcionalidade existir

## Telas essenciais da area central

### 1. Dashboard Central

Objetivo:

- dar visao consolidada da operacao

Acoes principais:

- ver resumo de barracas
- ver alertas operacionais
- entrar em barracas e acessos

Dados esperados:

- barracas ativas
- alertas ou incidentes
- sinalizacao operacional geral

### 2. Lista de Barracas

Objetivo:

- permitir que a gestao central consulte e gerencie barracas

Acoes principais:

- listar barracas
- buscar barraca
- abrir detalhe da barraca
- criar ou ajustar cadastro quando a etapa existir

### 3. Detalhe da Barraca na Area Central

Objetivo:

- aprofundar a governanca sobre uma barraca especifica

Acoes principais:

- ver dados cadastrais
- ver estado operacional resumido
- ver membros vinculados
- ajustar vinculacoes quando permitido

### 4. Gestao de Usuarios e Acessos

Objetivo:

- administrar roles e vinculacoes de usuarios

Acoes principais:

- listar usuarios administrativos
- ver role atual
- vincular usuario a barraca
- ajustar papel administrativo central

### 5. Visao de Suporte Operacional

Objetivo:

- ajudar a investigacao de incidentes sem virar painel operacional da barraca

Acoes principais:

- consultar pedidos ou barracas com problema
- ver estado resumido do fluxo
- apoiar suporte com rastreabilidade minima

Regra:

- esta tela e de suporte e governanca, nao substitui o painel cotidiano da barraca

## Fluxo principal de navegacao

```txt
Login
  -> Dashboard da Barraca
  -> Dashboard Central

Dashboard da Barraca
  -> Lista de Pedidos da Barraca
  -> Cardapio da Barraca
  -> Configuracoes Basicas da Barraca

Lista de Pedidos da Barraca
  -> Detalhe do Pedido da Barraca

Cardapio da Barraca
  -> Detalhe / Edicao de Item da Barraca

Dashboard Central
  -> Lista de Barracas
  -> Gestao de Usuarios e Acessos
  -> Visao de Suporte Operacional

Lista de Barracas
  -> Detalhe da Barraca na Area Central
```

## Estados vazios prioritarios

### Lista de pedidos vazia

Quando usar:

- barraca sem pedidos ativos no momento

Mensagem esperada:

- nenhuma fila ativa agora

### Cardapio vazio

Quando usar:

- barraca ainda sem itens cadastrados

Mensagem esperada:

- nenhum item disponivel no cardapio

### Lista de barracas vazia

Quando usar:

- plataforma ainda sem barracas cadastradas no contexto

Mensagem esperada:

- nenhuma barraca cadastrada

### Gestao de usuarios vazia

Quando usar:

- nenhum usuario administrativo vinculado

Mensagem esperada:

- nenhum acesso administrativo configurado

## Estados de erro prioritarios

### Usuario autenticado sem vinculo de barraca

Tratamento:

- bloquear area operacional
- mostrar mensagem clara de acesso nao configurado

### Usuario sem role valida para a area

Tratamento:

- negar acesso
- orientar retorno ao contexto permitido

### Falha ao carregar pedidos

Tratamento:

- mostrar erro curto
- permitir tentar novamente

### Falha ao executar transicao invalida

Tratamento:

- bloquear acao
- informar que o estado atual nao permite a operacao

### Falha ao carregar barracas ou acessos

Tratamento:

- mostrar erro curto
- permitir recarregar

## Regras de navegacao importantes

- a area da barraca e a area central devem ter navegacoes separadas
- `truck_operator` e `truck_manager` nao devem cair em telas centrais por padrao
- `platform_admin` nao deve operar o fluxo cotidiano da barraca como caminho principal
- o detalhe do pedido precisa expor apenas acoes coerentes com o estado atual

## Impacto no backlog

- `FT-021` deve usar este mapa para configurar layout e navegacao base do admin
- `FT-022` deve estruturar rotas do admin a partir desta divisao
- `FT-016` deve reforcar no backend a fronteira entre area da barraca e area central

## Criterio de sucesso

Este mapa esta correto quando:

- as telas da barraca estao listadas
- as telas da gestao central estao listadas
- a separacao entre contextos esta clara
- as acoes operacionais principais estao previstas
