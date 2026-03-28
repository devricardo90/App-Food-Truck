# Execucao do Backlog

## Logica central

O Agente Senior Orquestrador:

- analisa o projeto e o estado atual
- registra e organiza o trabalho em `backlog.md`
- define status e dependencias
- escolhe a proxima task `READY`
- delega ao subagente certo
- revisa a entrega
- aprova ou bloqueia
- atualiza `backlog.md`
- libera commit quando a task estiver validada

Isso cria um fluxo em camadas, sem bagunca e sem subagente mexendo em tudo ao mesmo tempo.

## Status oficiais

- `BLOCKED`: depende de outra task
- `TODO`: existe, mas ainda nao esta pronta
- `READY`: pode ser executada agora
- `IN_PROGRESS`: esta em execucao com subagente
- `REVIEW`: foi entregue e aguarda revisao
- `DONE`: foi aprovada e finalizada

## Regra de ouro

So pode sair do backlog uma task com status `READY`.

O orquestrador nunca pega:

- task bloqueada
- task ambigua
- task grande demais
- task sem criterio de aceite

## Sequencia correta

1. O orquestrador le `backlog.md`
2. Valida a proxima `READY`
3. Gera Task Contract
4. Escolhe skill e subagente
5. Delega com contexto completo
6. Recebe Delivery Report
7. Revisa com rigor
8. Atualiza `backlog.md`
9. Commita se aprovado
10. Aguarda novo gatilho

## Regra de destravamento

Quando uma task termina, o orquestrador deve reavaliar o backlog.

Exemplo:

- `FT-001` terminou
- `FT-002`, `FT-003` e `FT-004` dependiam dela
- essas tasks podem passar de `BLOCKED` para `READY`

Essa transicao deve ser explicita no proprio `backlog.md`.

## Como escolher entre varias READY

Quando houver mais de uma `READY`, priorizar por:

1. impacto estrutural
2. dependencia para outras tasks
3. risco tecnico
4. valor para o MVP

## Regra de commit

O commit entra apenas depois de:

- entrega do subagente
- revisao do orquestrador
- checks obrigatorios
- atualizacao do `backlog.md`

## Regra de modelagem de task

Cada task deve ser:

- pequena o suficiente para revisar
- grande o suficiente para gerar valor
- isolada o bastante para nao baguncar outra frente

Evite:

- "fazer auth completa"
- "criar todo o app mobile"
- "montar backend inteiro"

Prefira:

- "configurar Clerk no mobile"
- "criar schema inicial de User/Truck/Event"
- "implementar endpoint GET /trucks"
- "criar tela de lista de barracas"
