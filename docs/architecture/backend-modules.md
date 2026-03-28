# Modulos Iniciais do Backend

## Objetivo

Definir a arquitetura inicial de modulos do backend NestJS do Foodtrucks para evitar acoplamento prematuro, deixar claras as fronteiras de dominio e orientar a implementacao incremental da API.

## Principios

- cada modulo deve ter uma responsabilidade primaria clara
- regras de negocio vivem no backend, nao no frontend
- integracoes externas ficam isoladas em modulos proprios
- modulos de dominio nao devem depender diretamente de detalhes de transporte HTTP
- Prisma e banco sao infraestrutura compartilhada, nao dominio
- auth e autorizacao devem atravessar os modulos sem misturar responsabilidade de negocio

## Estrutura base

O backend parte desta estrutura:

- `AppModule`: composicao raiz
- `HealthModule`: healthcheck tecnico
- `PrismaModule`: acesso compartilhado ao banco
- `Common`: utilitarios, contratos internos e componentes transversais
- `Config`: leitura e validacao de configuracao

Sobre essa base, o MVP deve crescer com modulos de dominio e integracao.

## Modulos alvo do MVP

### `HealthModule`

Responsabilidade:

- expor healthcheck tecnico
- servir verificacoes simples de disponibilidade do backend

Dependencias permitidas:

- nenhuma dependencia de dominio

### `AuthModule`

Responsabilidade:

- validar identidade recebida do provider oficial
- resolver contexto autenticado do usuario
- aplicar base de autorizacao por role

Entradas principais:

- token do Clerk vindo de mobile e admin

Saidas principais:

- user context autenticado
- dados minimos de identidade para o dominio

Dependencias permitidas:

- `UsersModule`
- `MembershipsModule`
- `Config`

Nao deve depender de:

- `OrdersModule`
- `PaymentsModule`
- `NotificationsModule`

### `UsersModule`

Responsabilidade:

- manter usuario local de dominio
- sincronizar identidade externa com registro interno
- expor leitura basica de usuario para outros modulos

Dependencias permitidas:

- `PrismaModule`

Nao deve depender de:

- modulos operacionais de pedido ou pagamento

### `MembershipsModule`

Responsabilidade:

- gerenciar vinculos entre usuario, barraca e papel operacional
- decidir se um usuario pode operar uma barraca especifica

Dependencias permitidas:

- `UsersModule`
- `TrucksModule`
- `PrismaModule`

### `EventsModule`

Responsabilidade:

- gerenciar eventos e estado do evento
- expor a relacao entre evento e barracas participantes

Dependencias permitidas:

- `PrismaModule`
- `TrucksModule`

### `TrucksModule`

Responsabilidade:

- gerenciar barracas
- expor dados centrais da barraca para operacao e admin

Dependencias permitidas:

- `PrismaModule`

### `CatalogModule`

Responsabilidade:

- gerenciar categorias e itens do cardapio
- controlar disponibilidade e estoque diario no nivel do item

Dependencias permitidas:

- `TrucksModule`
- `EventsModule`
- `PrismaModule`

Nao deve depender de:

- `PaymentsModule`

### `OrdersModule`

Responsabilidade:

- criar e consultar pedidos
- aplicar a maquina de estados oficial
- registrar historico de transicoes
- proteger regras de capacidade por janela e consistencia operacional

Dependencias permitidas:

- `CatalogModule`
- `EventsModule`
- `TrucksModule`
- `UsersModule`
- `PrismaModule`

Pode publicar eventos para:

- `NotificationsModule`
- `PaymentsModule`

Nao deve depender diretamente de:

- provider de push
- provider de pagamento

### `PaymentsModule`

Responsabilidade:

- criar contexto financeiro do pedido
- receber confirmacoes externas de pagamento
- aplicar idempotencia
- atualizar estado financeiro sem violar a maquina de pedidos

Dependencias permitidas:

- `OrdersModule`
- `UsersModule`
- `PrismaModule`
- `Config`

Integracoes externas:

- Stripe no momento adequado da stack

### `NotificationsModule`

Responsabilidade:

- disparar notificacoes derivadas de eventos do backend
- manter separacao entre regra de negocio e canal de entrega

Dependencias permitidas:

- `OrdersModule`
- `UsersModule`
- `Config`

Integracoes externas:

- push como canal principal do MVP
- SMS somente se futura task aprovar

### `SubscriptionsModule`

Responsabilidade:

- tratar mensalidade da barraca com a plataforma
- separar cobranca recorrente da cobranca transacional do pedido

Dependencias permitidas:

- `TrucksModule`
- `UsersModule`
- `PaymentsModule`
- `PrismaModule`

## Dependencias permitidas entre modulos

Fluxo alvo:

```txt
Auth -> Users -> Memberships
Events -> Trucks
Catalog -> Trucks + Events
Orders -> Catalog + Events + Trucks + Users
Payments -> Orders + Users
Notifications -> Orders + Users
Subscriptions -> Trucks + Users + Payments
```

## Regras de fronteira

### 1. `OrdersModule` e a autoridade do ciclo do pedido

- nenhum outro modulo pode mudar estado operacional do pedido por conta propria
- pagamento confirma elegibilidade
- notificacao reage a evento
- auth libera acesso

### 2. `PaymentsModule` controla estado financeiro, nao a operacao da barraca

- pagamento aprovado nao significa preparo iniciado
- transicao para `new` continua passando pela regra oficial do backend

### 3. `NotificationsModule` nao decide negocio

- notificacao consome evento do backend
- push ou SMS nao podem redefinir verdade do sistema

### 4. `AuthModule` nao guarda regra de dominio espalhada

- auth valida identidade
- RBAC consulta roles, memberships e contexto
- regra operacional continua nos modulos de dominio

## Sequencia recomendada de implementacao

1. `AuthModule`
2. `UsersModule`
3. `MembershipsModule`
4. `OrdersModule`
5. `PaymentsModule`
6. `NotificationsModule`
7. `CatalogModule`
8. `EventsModule`
9. `TrucksModule`
10. `SubscriptionsModule`

## Observacoes do MVP

- a ordem acima e arquitetural; a ordem real do backlog ainda depende das tasks prontas
- no inicio, alguns modulos podem nascer apenas com contratos e services basicos
- controllers devem crescer junto com Swagger e OpenAPI
- DTOs e contratos HTTP devem refletir essas fronteiras, nao atalhos de implementacao

## Criterio de sucesso

Esta definicao esta correta quando:

- os modulos principais do MVP estao listados
- cada modulo tem responsabilidade clara
- as dependencias entre modulos estao limitadas
- o backend pode crescer sem concentrar tudo em um unico modulo generico
