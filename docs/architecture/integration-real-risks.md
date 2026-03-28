# Riscos e Atencao do Orquestrador - Fase de Integracao Real

## Contexto da fase

O projeto saiu da etapa de fundacao e entra agora na etapa de integracao funcional real entre backend, admin web e mobile.

A base ja existe:

- protocolo operacional consolidado
- backlog canonico
- matriz de versoes
- monorepo `pnpm` + `turbo`
- TypeScript, ESLint e Prettier
- backend Nest inicializado
- Prisma 7 + PostgreSQL 16.13
- Swagger + Scalar
- auth base no backend com Clerk, guard, contexto e roles
- mobile Expo 52 inicializado
- admin Next 16 inicializado
- documentacao estrutural do produto definida

A partir daqui, o maior risco nao e mais infra.
O maior risco passa a ser a inconsistencia entre autenticacao, autorizacao, contexto de foodtruck e consumo real da API pelos frontends.

## Objetivo do proximo marco

Primeira navegacao autenticada real com contexto de usuario e foodtruck funcionando entre backend, admin e mobile.

## Regra de nomenclatura do dominio

Neste projeto, o termo oficial do dominio e:

- `foodtruck`

Nao usar em novas entregas:

- barraca
- stand
- booth

Usar sempre:

- foodtruck
- contexto do foodtruck
- membership do foodtruck
- foodtruck ativo
- owner do foodtruck
- staff do foodtruck

Essa regra vale para:

- codigo
- DTOs
- rotas
- documentacao
- backlog
- interface
- prompts de agentes

Observacao:

- documentos antigos podem conter o termo `barraca` por legado
- novas tasks e novas alteracoes nao devem propagar esse naming

## Risco 1 - Auth parecer pronta, mas estar incompleta

### Descricao

Ter guard, provider e contexto no backend nao significa que a autenticacao esta fechada ponta a ponta.

O risco e existir uma auth aparentemente pronta, mas com diferencas entre:

- geracao do token
- persistencia da sessao
- envio do token para a API
- resolucao do usuario autenticado
- expiracao da sessao
- logout
- renovacao de sessao

### Atencao do orquestrador

Validar sempre:

- como a sessao nasce
- onde a sessao e armazenada
- como a sessao expira
- como o frontend detecta expiracao
- como a API recebe a identidade do usuario
- como o backend resolve o usuario autenticado
- como o backend resolve roles e memberships
- como logout limpa sessao e estado local

### Regra

Nao considerar auth pronta enquanto backend, admin e mobile nao estiverem autenticando de forma coerente e verificavel.

## Risco 2 - Diferenca de comportamento entre Admin Web e Mobile

### Descricao

Web e mobile sao clientes diferentes.
A logica de produto pode ser a mesma, mas a implementacao da sessao nao sera identica.

### No Admin Web, atencao para

- cookie vs bearer token
- middleware ou proxy protegendo rotas
- redirect loop
- render antes de resolver sessao
- inconsistencia entre SSR, client e navegacao protegida

### No Mobile, atencao para

- persistencia da sessao
- armazenamento seguro
- restauracao da sessao ao abrir o app
- expiracao de token
- logout limpando cache e estado
- tela mostrar usuario logado sem API autenticada real

### Regra

Nunca assumir que resolver auth no admin significa que o mobile esta resolvido tambem.

## Risco 3 - Contrato instavel entre Frontend e Backend

### Descricao

O frontend nao pode depender de suposicao.
O backend precisa expor um contrato estavel para o usuario autenticado e para o contexto do foodtruck.

### Contratos criticos

- `GET /auth/me`
- shape do usuario autenticado
- roles
- memberships
- foodtruck ativo
- permissoes minimas
- erros padronizados

### Sintomas de contrato ruim

- frontend faz adaptacao improvisada
- nomes diferentes para o mesmo conceito
- campo muda de nome sem atualizacao do cliente
- payload diferente entre ambientes
- regras de role espalhadas no frontend

### Regra

Toda mudanca de contrato exige atualizacao coordenada em DTO, docs e cliente consumidor.

## Risco 4 - Modelagem fraca de User, Membership e Foodtruck Context

### Descricao

Autenticar o usuario e so o comeco.
O ponto critico e definir corretamente o vinculo entre usuario e foodtruck.

### Perguntas obrigatorias do dominio

- um usuario pode ter 1 ou varios foodtrucks?
- um usuario pode ser owner de um foodtruck e staff de outro?
- existe foodtruck ativo?
- onde o foodtruck ativo e resolvido?
- o foodtruck ativo vem do banco, da sessao, do request ou de header?
- e possivel trocar de contexto?
- super admin enxerga tudo?
- owner enxerga so o proprio foodtruck?
- staff tem acesso parcial?

### Entidades que precisam estar claras

- `User`
- `Foodtruck`
- `Membership`
- `Role`
- `ActiveFoodtruckContext`

### Regra

Nao escalar features de negocio antes de o modelo de membership e contexto do foodtruck estar fechado.

## Risco 5 - Misturar autenticacao com autorizacao

### Descricao

Sao problemas diferentes:

- autenticacao: quem e o usuario
- autorizacao: o que ele pode fazer
- escopo: em qual foodtruck a acao ocorre

Misturar essas camadas gera falhas de seguranca e comportamento inconsistente.

### Atencao do orquestrador

Garantir separacao entre:

- validacao de identidade
- validacao de role
- validacao de membership
- validacao de escopo do foodtruck

### Regra

Usuario autenticado nao significa usuario autorizado.

## Risco 6 - Frontend assumir regra critica sem confirmacao do backend

### Descricao

E aceitavel usar o frontend para UX.
Nao e aceitavel usar o frontend como fonte de verdade de seguranca.

### Pode no frontend

- esconder botao
- mostrar badge
- adaptar navegacao
- exibir estado visual

### Nao pode depender so do frontend

- permitir acao sensivel
- autorizar acesso a recurso
- definir escopo de foodtruck
- validar role real

### Regra

O backend e sempre a fonte de verdade para permissao e escopo.

## Risco 7 - Problemas silenciosos de integracao HTTP

### Descricao

Nesta fase, muitos erros vem de detalhes operacionais e nao da logica de negocio.

### Pontos de atencao

- base URL errada
- `localhost` no mobile
- headers inconsistentes
- CORS incompleto
- token nao enviado
- token enviado no formato errado
- proxy mascarando erro real
- ambiente local diferente do ambiente esperado

### Regra

Toda integracao deve ser validada com fluxo real de request autenticado, nao apenas com healthcheck ou tela renderizada.

## Risco 8 - Estado global inconsistente apos login, logout e troca de contexto

### Descricao

Quando auth entra, o estado do frontend pode se fragmentar entre:

- store
- cache
- queries
- layout protegido
- estado visual local

### Sintomas comuns

- usuario troca conta e ve dado antigo
- logout parcial
- foodtruck anterior continua em cache
- tela protegida abre por engano
- app acha que esta logado, mas a API responde `401`

### Atencao do orquestrador

Definir claramente:

- fonte de verdade da sessao
- politica de invalidacao de cache
- comportamento no login
- comportamento no logout
- comportamento ao trocar foodtruck
- comportamento ao receber `401`

### Regra

Login, logout e troca de contexto devem limpar ou invalidar todo dado sensivel dependente da sessao.

## Risco 9 - Tratamento incorreto de `401`, `403` e `404`

### Descricao

Esses status precisam ser previsiveis.

### Padrao esperado

- `401 Unauthorized`: usuario nao autenticado ou sessao invalida
- `403 Forbidden`: usuario autenticado, mas sem permissao
- `404 Not Found`: recurso inexistente ou nao revelado

### Regra

A API deve ter padrao de erro unico e os frontends devem reagir corretamente a cada status.

## Risco 10 - Comecar catalogo e pedidos antes de fechar identidade e contexto

### Descricao

Catalogo e pedidos dependem diretamente de:

- quem esta operando
- qual foodtruck esta ativo
- qual role o usuario possui
- qual escopo de dados ele pode acessar

Se essas decisoes nao estiverem fechadas, o retrabalho sera alto.

### Regra

Nao iniciar implementacao funcional seria de catalogo e pedidos antes de `/auth/me` e contexto de foodtruck estarem estaveis.

## Risco 11 - Swagger e Scalar ficarem defasados

### Descricao

Nesta fase, o contrato muda rapido.
Se Swagger e Scalar nao forem atualizados junto, a documentacao perde valor.

### Atencao do orquestrador

Toda task que altera contrato deve revisar:

- request DTO
- response DTO
- decorators
- exemplos
- erros possiveis
- autenticacao do endpoint

### Regra

Documentacao de API faz parte da entrega. Nao e etapa opcional.

## Risco 12 - Testes cobrirem scaffold e nao o fluxo sensivel

### Descricao

O projeto ja tem scaffold. Agora os testes precisam proteger as partes frageis da integracao.

### Casos minimos prioritarios

- endpoint protegido aceita usuario valido
- endpoint protegido rejeita ausencia de autenticacao
- role bloqueia acesso indevido
- membership resolve foodtruck corretamente
- `/auth/me` retorna shape estavel
- admin trata `401` corretamente
- mobile trata `401` corretamente
- logout limpa sessao e cache
- troca de foodtruck atualiza contexto corretamente

### Regra

O foco dos proximos testes deve ser fluxo autenticado real, nao apenas cobertura superficial.

## Risco 13 - Mudanca estrutural fora da READY oficial

### Descricao

Na fase de integracao, e comum resolver rapido fora do backlog oficial.
Isso gera divida oculta.

### Sintomas

- contrato mudou sem registro
- auth foi ajustada sem documentacao
- naming ficou inconsistente
- frontend contornou falha do backend
- middleware, guards ou providers foram alterados sem decisao formal

### Regra

Nenhuma mudanca estrutural de auth, contexto, client API ou dominio deve acontecer fora de READY oficial.

## Areas de atencao maxima do orquestrador

### 1. Identidade

Fechar sem ambiguidade:

- provider oficial de auth
- formato da sessao
- estrategia do admin
- estrategia do mobile
- login
- logout
- expiracao
- recuperacao de sessao

### 2. Contexto do foodtruck

Fechar:

- membership
- role
- ownership
- foodtruck ativo
- troca de contexto
- resolucao do escopo em cada request

### 3. Contrato entre backend e frontends

Fechar:

- `/auth/me`
- payload oficial
- headers
- padroes de erro
- tipagem consistente
- nomenclatura consistente

### 4. Cliente HTTP

Padronizar:

- envio de autenticacao
- tratamento de erro
- retry consciente
- base URL por ambiente
- interceptacao de `401` e `403`
- logs uteis

### 5. Seguranca real

Validar:

- rota protegida no admin
- tela protegida no mobile
- endpoint protegido no backend
- escopo por foodtruck
- nenhuma confianca exclusiva no frontend

## Regras mandatorias do orquestrador

1. Nao iniciar catalogo e pedidos antes de auth real + `/auth/me` + contexto de foodtruck estarem estaveis.
2. Toda task de auth deve validar backend, admin e mobile, e nao apenas um cliente isolado.
3. Nenhum frontend pode assumir regra critica sem confirmacao do backend.
4. Toda mudanca de contrato deve atualizar docs, DTOs e consumidor.
5. `401`, `403`, foodtruck ativo e troca de contexto precisam ter comportamento definido antes da expansao funcional.
6. Nao duplicar logica de sessao em multiplos pontos sem necessidade.
7. Toda decisao estrutural de auth, membership e contexto precisa ficar registrada no protocolo ou backlog.
8. Nenhuma READY deve ser marcada como concluida sem evidencia funcional real.

## Ordem estrategica recomendada do proximo ciclo

1. fechar modelo de `User + Membership + Foodtruck Context`
2. implementar `GET /auth/me` de forma estavel
3. integrar auth real no admin web
4. integrar auth real no mobile
5. padronizar client API autenticado nos dois frontends
6. validar contexto do foodtruck ponta a ponta
7. iniciar dominio funcional de catalogo
8. iniciar dominio funcional de pedidos

## Criterio de avanco de fase

So considerar que a fase foi vencida quando existir, de forma real e verificavel:

- login funcional
- sessao persistida corretamente
- `GET /auth/me` estavel
- usuario autenticado resolvido no backend
- membership resolvida corretamente
- foodtruck ativo resolvido corretamente
- admin consumindo API autenticada real
- mobile consumindo API autenticada real
- tratamento correto de `401` e `403`
- documentacao atualizada
- evidencia minima de teste ou validacao funcional

## Sintese executiva

A fundacao esta pronta.
O proximo risco do projeto nao e infraestrutura. E consistencia.

Se identidade, membership, contexto do foodtruck e contrato entre backend, admin e mobile forem fechados corretamente agora, o restante do MVP acelera com menos retrabalho.

Se essa camada nascer inconsistente, catalogo, pedidos, checkout, notificacoes e cobranca serao construidos em terreno instavel.
