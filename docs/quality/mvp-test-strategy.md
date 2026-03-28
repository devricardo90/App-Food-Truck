# Estrategia Minima de Testes do MVP

## Objetivo

Definir quais fluxos criticos do MVP precisam de cobertura minima antes de staging e qual tipo de verificacao cada fluxo exige.

## Principios

- o MVP nao precisa de cobertura maxima; precisa de cobertura suficiente nos riscos certos
- fluxo critico vale mais que cobertura cosmetica
- pedido, pagamento, estoque, capacidade e notificacao exigem verificacao explicita
- antes de staging, o sistema precisa provar que nao quebra o fluxo principal de compra e operacao

## Escopo da estrategia

Esta estrategia define:

- fluxos obrigatorios
- niveis minimos de teste
- criterio minimo para entrada em staging

Esta estrategia nao define:

- framework de teste especifico
- percentuais de cobertura por arquivo
- pipeline final de CI

## Niveis de teste do MVP

Para o MVP, usar quatro niveis de verificacao:

### 1. Testes unitarios

Uso:

- regras de negocio pequenas
- validacao de transicoes
- calculos e guardas de integridade

### 2. Testes de integracao

Uso:

- backend com banco ou camada de persistencia
- relacao entre pedido, pagamento, estoque e capacidade
- guards e autorizacao

### 3. Testes de contrato / API

Uso:

- contratos principais da API
- consistencia entre request, response e documentacao

### 4. Testes de fluxo ponta a ponta

Uso:

- percursos criticos do usuario e da barraca
- validacao final antes de staging

## Fluxos obrigatorios antes de staging

### 1. Checkout -> pagamento confirmado -> pedido `new`

Risco:

- cliente paga e pedido nao nasce corretamente

Minimo exigido:

- integracao no backend para confirmacao de pagamento e criacao do pedido
- fluxo ponta a ponta do caso nominal

### 2. Pagamento falho -> pedido nao entra na fila

Risco:

- barraca receber pedido sem pagamento valido

Minimo exigido:

- integracao no backend para falha financeira
- validacao de que o pedido nao vira `new`

### 3. Transicoes validas da maquina de estados

Fluxo:

- `new -> in_progress -> ready -> completed`

Risco:

- barraca operar pedido em estado errado

Minimo exigido:

- testes unitarios ou de integracao cobrindo transicoes validas
- verificacao de bloqueio de transicoes invalidas relevantes

### 4. Capacidade por janela

Risco:

- barraca aceitar pedidos acima da capacidade

Minimo exigido:

- integracao da regra de capacidade
- caso de limite atingido bloqueando confirmacao de pedido

### 5. Estoque diario / indisponibilidade

Risco:

- vender item indisponivel ou saldo negativo

Minimo exigido:

- integracao da revalidacao de disponibilidade no checkout
- caso de item indisponivel bloqueando confirmacao

### 6. Notificacao de pedido pronto

Risco:

- pedido chega a `ready` e o cliente fica sem sinalizacao minima

Minimo exigido:

- teste de integracao do evento de notificacao no backend
- validacao do fallback pelo estado do pedido no app

### 7. Autorizacao basica por role

Risco:

- usuario acessar area errada

Minimo exigido:

- integracao de guards e escopo por role no backend
- teste de bloqueio para acesso indevido a area da barraca ou area central

## Matriz minima por area

| Area | Unitario | Integracao | Contrato/API | E2E |
| --- | --- | --- | --- | --- |
| Maquina de estados do pedido | obrigatorio | obrigatorio | opcional | obrigatorio no fluxo nominal |
| Pagamento | obrigatorio nas regras criticas | obrigatorio | obrigatorio | obrigatorio no fluxo nominal |
| Capacidade | obrigatorio nas regras | obrigatorio | nao obrigatorio isoladamente | desejavel no fluxo nominal |
| Estoque | obrigatorio nas regras | obrigatorio | nao obrigatorio isoladamente | desejavel no fluxo nominal |
| Auth/RBAC | obrigatorio nas regras criticas | obrigatorio | opcional | desejavel para acesso principal |
| Notificacoes | opcional nas regras pequenas | obrigatorio | nao obrigatorio isoladamente | desejavel para o caso de pedido pronto |

## Casos minimos obrigatorios

Antes de staging, o MVP deve provar no minimo:

1. pedido nao confirma sem pagamento valido
2. pagamento confirmado gera pedido operacional unico
3. transicao invalida de pedido e bloqueada
4. barraca lotada nao aceita pedido acima da janela
5. item indisponivel nao passa no checkout
6. usuario sem role ou vinculo correto nao acessa area administrativa indevida
7. pedido pronto gera evento de notificacao e continua rastreavel no estado oficial

## O que pode ficar fora do primeiro corte de testes

Pode ficar fora do primeiro corte, se o fluxo critico estiver coberto:

- cobertura extensa de UI cosmetica
- snapshot em excesso
- cenarios raros de borda nao ligados ao fluxo principal
- cargas complexas e testes de performance formais

## Regra de entrada em staging

O MVP so pode entrar em staging quando:

- testes unitarios criticos passam
- testes de integracao dos fluxos obrigatorios passam
- contratos principais da API estao coerentes quando a etapa da API existir
- pelo menos um fluxo ponta a ponta nominal de compra e operacao foi validado
- nao existe regressao conhecida no caminho pedido -> pagamento -> novo pedido -> preparo -> pronto

## Checklist minimo antes de staging

- checkout nominal validado
- falha de pagamento validada
- maquina de estados validada
- capacidade validada
- estoque validado
- notificacao minima validada
- autorizacao minima validada

## Impacto no backlog

- `FT-029` deve materializar scripts e estrutura para suportar essa estrategia
- `FT-009` em diante deve aplicar essa regra no backend
- tarefas de API e app devem herdar estes fluxos como base de verificacao

## Criterio de sucesso

Esta estrategia esta correta quando:

- os fluxos obrigatorios estao listados
- os niveis de teste estao definidos
- existe regra objetiva para entrada em staging
- o MVP nao depende de interpretacao informal para saber o que precisa ser validado
