# Fluxo Oficial de Pagamento do Pedido

## Objetivo

Definir como o pagamento se relaciona com o pedido no MVP do Foodtrucks para garantir que nenhum pedido operacional seja confirmado antes da validacao financeira.

## Principios

- pagamento e pedido sao entidades relacionadas, mas com estados distintos
- pedido pode nascer em `pending_payment`, mas so entra na operacao quando o pagamento estiver confirmado
- confirmacao financeira precisa ser idempotente
- webhook ou callback do provedor e a fonte principal de confirmacao
- frontend nao confirma pagamento por conta propria

## Estados oficiais do pagamento

### `pending`

Significado:

- tentativa de pagamento foi criada
- ainda nao ha confirmacao final do provedor

### `authorized`

Significado:

- o provedor autorizou a transacao
- so deve ser usado se o modelo de captura separar autorizacao de captura

Regra do MVP:

- se o provedor operar com confirmacao simples, este estado pode nao aparecer na interface

### `paid`

Significado:

- pagamento foi confirmado com sucesso
- o pedido pode sair de `pending_payment` para `new`

### `failed`

Significado:

- tentativa falhou definitivamente
- pedido nao pode entrar na fila operacional

### `cancelled`

Significado:

- pagamento foi cancelado antes da confirmacao
- pedido deve encerrar sem operacao

### `refunded`

Significado:

- valor foi devolvido total ou parcialmente depois de uma falha operacional ou cancelamento

Regra do MVP:

- o estado existe no dominio, mas o fluxo detalhado de reembolso pode ser simplificado no primeiro corte

## Relacao entre pagamento e pedido

### Criacao inicial

1. cliente inicia checkout
2. backend cria pedido em `pending_payment`
3. backend cria registro de pagamento em `pending`
4. backend solicita sessao ou intent ao provedor

### Confirmacao

1. provedor envia webhook ou callback confiavel
2. backend valida autenticidade do evento
3. backend aplica idempotencia
4. backend atualiza pagamento para `paid`
5. backend atualiza pedido para `new`
6. barraca passa a enxergar o pedido

### Falha

1. pagamento falha ou expira
2. backend atualiza pagamento para `failed` ou `cancelled`
3. backend atualiza pedido para `cancelled`
4. pedido nao entra na fila da barraca

## Fluxo nominal

```txt
Pedido:    pending_payment ----------------------------> new
Pagamento: pending -> paid
```

## Fluxo de falha

```txt
Pedido:    pending_payment ----------------------------> cancelled
Pagamento: pending -> failed|cancelled
```

## Origem de cada mudanca

### Cliente

Pode:

- iniciar checkout
- reenviar tentativa de pagamento se o produto permitir
- abandonar a compra

Nao pode:

- marcar pagamento como `paid`
- marcar pedido como `new`

### Frontend

Pode:

- exibir estado atual
- encaminhar dados para o provedor
- informar retorno visual ao usuario

Nao pode:

- decidir confirmacao financeira final
- promover pedido para fila operacional

### Backend

Pode:

- criar pedido e pagamento
- validar evento do provedor
- aplicar idempotencia
- atualizar estados oficiais

### Provedor de pagamento

Pode:

- informar sucesso
- informar falha
- informar cancelamento
- informar reembolso

## Webhook ou callback previsto

O MVP precisa prever um canal server-to-server confiavel do provedor para o backend.

Requisitos:

- validar assinatura ou autenticidade do evento
- armazenar identificador externo do pagamento
- registrar payload minimo util para auditoria
- ignorar reprocessamento duplicado com seguranca

## Regra de idempotencia

Cada confirmacao do provedor precisa ser tratada como potencialmente duplicada.

O backend deve garantir que:

- o mesmo evento nao gere dois pagamentos `paid`
- o mesmo pagamento nao gere dois pedidos `new`
- reentrega de webhook nao cause duplicidade de notificacao ou de entrada operacional

Chaves recomendadas para idempotencia:

- `provider_payment_id`
- `provider_event_id`
- `order_id`

## Casos de erro e tratamento esperado

### 1. Cliente volta do checkout como sucesso, mas o webhook nao chegou ainda

Tratamento:

- frontend mostra estado pendente
- backend continua aguardando confirmacao oficial
- pedido permanece em `pending_payment`

### 2. Webhook chega antes do frontend receber retorno

Tratamento:

- backend atualiza pagamento e pedido normalmente
- frontend apenas consulta o estado atual ao recarregar

### 3. Webhook duplicado

Tratamento:

- backend reconhece evento ja aplicado
- nao recria pedido
- nao repete efeitos colaterais criticos

### 4. Pagamento falha depois de tentativa inicial

Tratamento:

- pagamento vira `failed`
- pedido vai para `cancelled`
- barraca nunca recebe esse pedido como ativo

### 5. Pedido precisa ser cancelado depois de pagamento confirmado

Tratamento:

- pedido pode ir para `cancelled`
- pagamento pode exigir `refunded`
- fluxo financeiro e operacional devem ficar auditaveis

## Regras de implementacao

- pedido e pagamento devem compartilhar referencia estavel
- backend e a autoridade final dos dois estados
- a barraca so visualiza pedidos com pagamento confirmado
- logs devem registrar criacao, confirmacao, falha, cancelamento e reembolso
- notificacao de pedido confirmado deve sair somente depois de `paid` + `new`

## Resumo operacional

1. checkout inicia
2. pedido nasce em `pending_payment`
3. pagamento nasce em `pending`
4. provedor confirma
5. backend valida e aplica idempotencia
6. pagamento vira `paid`
7. pedido vira `new`
8. barraca recebe o pedido
