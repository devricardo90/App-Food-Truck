# Jornadas Oficiais das 3 Personas

## Objetivo

Formalizar as jornadas oficiais do cliente, da barraca e da gestao central no MVP do Foodtrucks para orientar produto, UX, telas, regras operacionais e prioridades de implementacao.

## Principios

- cada jornada deve refletir um objetivo real de negocio
- a experiencia do cliente precisa ser rapida e previsivel
- a operacao da barraca precisa privilegiar velocidade e baixa ambiguidade
- a gestao central precisa ter visibilidade e controle sem virar gargalo operacional
- pontos de friccao devem virar insumo para telas, regras e backlog tecnico

## Persona 1 - Cliente do evento

### Objetivo principal

Descobrir uma barraca, montar o pedido, pagar com seguranca e retirar sem incerteza.

### Jornada oficial

1. cliente abre o app do evento
2. cliente visualiza barracas disponiveis
3. cliente entra na barraca escolhida
4. cliente consulta cardapio e disponibilidade
5. cliente adiciona itens ao carrinho
6. cliente revisa o carrinho
7. cliente inicia checkout
8. cliente conclui pagamento
9. cliente recebe confirmacao do pedido
10. cliente acompanha o status no app
11. cliente recebe aviso quando o pedido estiver pronto
12. cliente retira o pedido

### Momentos criticos

- descoberta rapida da barraca correta
- leitura clara de disponibilidade e preco
- confirmacao sem duvida entre pagamento e pedido criado
- entendimento do estado atual do pedido
- identificacao do momento certo de retirada

### Pontos de friccao

- cardapio confuso ou lento em ambiente de evento
- item indisponivel descoberto tarde demais
- pagamento concluido sem feedback imediato de pedido confirmado
- falta de clareza entre pedido recebido e pedido em preparo
- notificacao falhar e o cliente nao perceber que o pedido esta pronto

### Implicacoes de produto

- o app precisa priorizar descoberta, cardapio, carrinho e status
- o checkout nao pode sugerir confirmacao antes do backend validar pagamento
- o status do pedido precisa ser visivel no app mesmo sem notificacao
- os estados de erro e indisponibilidade devem ser tratados cedo no design

## Persona 2 - Operador da barraca

### Objetivo principal

Receber pedidos com clareza, operar a fila sem perder tempo e sinalizar o andamento real do preparo.

### Jornada oficial

1. operador acessa o painel autenticado da barraca
2. operador visualiza novos pedidos confirmados
3. operador entende prioridade e fila atual
4. operador inicia preparo do pedido
5. operador acompanha pedidos em execucao
6. operador marca pedido como pronto
7. operador confirma retirada e encerra o pedido
8. operador ajusta disponibilidade de itens quando necessario

### Momentos criticos

- chegada confiavel do pedido novo
- leitura instantanea do estado da fila
- troca de status com poucos cliques
- controle manual rapido em caso de ruptura ou sobrecarga

### Pontos de friccao

- painel com ruido visual ou informacao excessiva
- pedido pago que nao aparece com rapidez suficiente
- dificuldade para distinguir `new`, `in_progress` e `ready`
- ausencia de mecanismo simples para indisponibilidade
- excesso de passos para atualizar status em horario de pico

### Implicacoes de produto

- o painel da barraca precisa ser orientado por operacao e nao por administracao
- a fila deve agrupar pedidos por estado operacional
- o sistema deve bloquear transicoes invalidas no backend e expor apenas acoes validas na interface
- controles de disponibilidade e capacidade precisam existir como fallback operacional

## Persona 3 - Gestao central da plataforma

### Objetivo principal

Manter a operacao minimamente governada, com visibilidade sobre barracas, acessos e estado geral do sistema.

### Jornada oficial

1. gestor acessa o painel central autenticado
2. gestor visualiza barracas e eventos sob responsabilidade
3. gestor consulta situacao operacional geral
4. gestor gerencia acessos e vinculacoes
5. gestor acompanha incidentes operacionais relevantes
6. gestor apoia correcao de problemas de operacao quando necessario

### Momentos criticos

- identificar rapidamente qual barraca ou evento esta com problema
- distinguir problema de operacao, acesso ou integracao
- manter governanca sem atrapalhar a operacao da barraca

### Pontos de friccao

- falta de visibilidade consolidada sobre barracas e usuarios
- dificuldade para entender quem pode acessar o que
- ausencia de rastreabilidade para suporte
- mistura entre tarefas da barraca e tarefas da gestao central

### Implicacoes de produto

- o admin precisa separar claramente area da barraca e area central
- roles e permissoes devem refletir responsabilidades diferentes
- logs, rastreabilidade e status operacionais precisam atender suporte desde cedo
- a gestao central precisa de visao suficiente para suporte, nao de BI completo no MVP

## Resumo dos pontos de friccao prioritarios

### Cliente

- indisponibilidade descoberta tarde
- incerteza entre pagamento e confirmacao do pedido
- baixa visibilidade do status e do momento de retirada

### Barraca

- perda de tempo para atualizar fila
- baixa confiabilidade percebida na chegada do pedido
- falta de controles operacionais simples em horario de pico

### Gestao central

- pouca visibilidade do estado operacional
- governanca fraca de acessos e vinculos
- dificuldade de suporte sem rastreabilidade

## Impacto direto no backlog

- `FT-007` deve derivar o mapa inicial de telas do mobile a partir da jornada do cliente
- `FT-008` deve derivar o mapa inicial de telas do admin a partir das jornadas da barraca e da gestao central
- `FT-015` deve definir roles coerentes com a separacao entre barraca e gestao central
- `FT-024` e `FT-025` devem tratar friccoes operacionais de sobrecarga e disponibilidade

## Criterio de sucesso

Esta definicao esta correta quando:

- a jornada do cliente esta clara do descobrimento ate a retirada
- a jornada da barraca esta clara do recebimento ao encerramento do pedido
- a jornada da gestao central esta clara para governanca e suporte
- os principais pontos de friccao estao mapeados
- as proximas tasks de telas, roles e regras operacionais conseguem usar este documento como base
