# Workflow - Protocolo Rick V1.0

## Fonte da verdade

O status oficial vive sempre em `backlog.md` na raiz.

Nada fora disso tem autoridade operacional.

- nao usar memoria solta
- nao confiar em contexto implcito
- nao decidir proxima task por `status.md`

Se nao esta em `backlog.md`, nao existe para o protocolo.

## Ciclo de vida oficial

```txt
BLOCKED -> TODO -> READY -> IN_PROGRESS -> REVIEW -> DONE
```

## Significado dos status

- `BLOCKED`: depende de outra task
- `TODO`: existe, mas ainda nao esta pronta
- `READY`: pode ser executada agora
- `IN_PROGRESS`: esta em execucao com subagente
- `REVIEW`: foi entregue e aguarda revisao do orquestrador
- `DONE`: foi aprovada, registrada no backlog e pode destravar dependentes

## Regra principal

O orquestrador sempre faz isto:

1. buscar `READY` em `backlog.md`
2. escolher a melhor pela prioridade oficial
3. delegar execucao
4. revisar entrega
5. atualizar `backlog.md`
6. marcar `DONE` quando aprovado
7. destravar dependentes
8. parar e aguardar novo gatilho

## Regra anti-caos

Nunca:

- executar task fora do `backlog.md`
- pular dependencia
- executar varias tasks ao mesmo tempo
- considerar `status.md` como fonte de verdade
- deixar task sem status claro

## Regra de qualidade

Se mexer em:

- pedido
- pagamento
- auth
- banco
- notificacao

a revisao deve ser mais rigida.
