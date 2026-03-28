# Politica de Versoes e Upgrades

## Objetivo

Formalizar a politica operacional de versoes do projeto para que nenhuma dependencia critica seja instalada, atualizada ou aprovada sem validacao, ordem e rastreabilidade.

## Documento fonte de versoes

A fonte oficial de versoes da stack e:

- `docs/architecture/version-matrix.md`

Regra:

- este documento define a politica operacional
- a `version-matrix.md` define as linhas e versoes oficiais

## Regra principal

Nenhuma dependencia critica pode ser instalada ou atualizada por impulso.

Antes de instalar, atualizar ou aprovar qualquer dependencia critica, e obrigatorio:

1. consultar a `version-matrix.md`
2. validar compatibilidade com a stack atual
3. respeitar a ordem oficial de instalacao
4. evitar `latest`
5. registrar impacto no projeto quando houver efeito arquitetural
6. bloquear a task se a versao oficial nao estiver definida

## O que e dependencia critica

Para o protocolo, dependencia critica inclui pelo menos:

- framework base
- runtime principal
- bibliotecas centrais do ecossistema Expo
- bibliotecas centrais do Next
- bibliotecas centrais do Nest
- ORM e banco
- auth
- pagamento
- notificacoes
- documentacao da API

Exemplos:

- Node
- pnpm
- Expo SDK
- React Native
- React
- Next.js
- NestJS
- Prisma
- PostgreSQL
- Clerk
- Stripe SDK
- Firebase Admin SDK
- `@nestjs/swagger`
- `@scalar/nestjs-api-reference`

## Regras obrigatorias de versao

### 1. Nunca usar `latest`

`latest` fica proibido em dependencia critica.

Motivo:

- reduz previsibilidade
- dificulta reproduzir ambiente
- aumenta risco de incompatibilidade silenciosa

### 2. Toda mudanca de versao exige task propria

Se a mudanca alterar versao critica:

- precisa de task propria no backlog
- precisa de revisao do orquestrador
- precisa de commit especifico

### 3. Versao nao definida bloqueia execucao

Se a versao oficial nao estiver na `version-matrix.md`:

- a task nao pode seguir
- o protocolo deve parar e voltar para revisao

### 4. Upgrade deve ser incremental

Regra:

- evitar salto de varias majors de uma vez
- preferir upgrade passo a passo
- validar o sistema entre uma etapa e outra

## Regra de compatibilidade por stack

### Monorepo base

- Node e pnpm precisam estar alinhados com a matrix
- TypeScript e tooling compartilhado devem seguir a base do monorepo

### Mobile

- o Expo SDK e a ancora principal de compatibilidade
- React Native, React e pacotes do ecossistema Expo devem seguir o que o SDK suportar
- quando houver duvida entre pacote third-party e Expo, prevalece a compatibilidade do Expo

### Admin web

- Next define a faixa de compatibilidade de React e React DOM
- auth web e libs transversais devem validar compatibilidade com o Next oficial do projeto

### API

- Nest define a base do backend
- Prisma e banco devem seguir a matrix
- SDKs externos precisam ser validados contra Node e Nest antes de entrar

## Ordem obrigatoria de decisao e instalacao

Toda mudanca deve seguir esta ordem:

1. framework-base
2. ecossistema oficial compativel
3. tooling compartilhado
4. bibliotecas transversais
5. integracoes externas
6. features especificas

## Regra especifica para Expo

No ecossistema Expo:

- sempre usar `npx expo install` quando aplicavel
- nunca pinar manualmente pacotes centrais do ecossistema Expo fora do que o SDK resolver
- upgrades de SDK devem ser incrementais e documentados

## Regra especifica para API

No backend:

- Swagger entra cedo e nao e opcional
- Scalar entra logo apos Swagger e nao e opcional quando a etapa exigir
- nenhuma mudanca de contrato pode acontecer sem atualizar a documentacao da API no mesmo ciclo

## Checklist antes da mudanca de versao

Antes de qualquer install ou upgrade critico, validar:

- versao esta definida na `version-matrix.md`
- compatibilidade com a stack atual
- ordem correta de instalacao
- risco principal da mudanca
- necessidade de atualizacao documental

Se qualquer resposta for insuficiente:

- a task deve ser bloqueada

## Checklist depois da mudanca de versao

Depois de qualquer install ou upgrade critico, validar:

- `lint`
- `typecheck`
- `tests`
- `build`
- docs atualizadas
- backlog impactado revisado

## Registro documental obrigatorio

Se a mudanca de versao impactar a arquitetura, e obrigatorio registrar:

- o que mudou
- por que mudou
- qual compatibilidade foi validada
- qual risco foi aceito ou mitigado

## Regra de aprovacao do orquestrador

O orquestrador nao pode aprovar task de dependencia se qualquer um destes pontos falhar:

- versao fora da matrix
- `latest` em dependencia critica
- ordem de instalacao desrespeitada
- compatibilidade nao validada
- impacto arquitetural nao registrado quando necessario

## Casos de bloqueio obrigatorio

Bloquear a task quando:

- a versao oficial nao existe na matrix
- a compatibilidade nao estiver clara
- o upgrade exigir salto excessivo sem estrategia incremental
- o pacote for central do Expo e nao estiver seguindo a regra do SDK
- a mudanca puder quebrar a API sem atualizacao de contrato

## Relacao com o backlog

- `FT-033` define a matrix oficial
- `FT-036` define a politica operacional
- tasks de setup e install posteriores devem obedecer estes documentos

## Criterio de sucesso

Esta politica esta correta quando:

- existe uma regra objetiva antes de instalar ou atualizar
- a matrix segue como fonte oficial de versoes
- upgrades criticos nao podem acontecer sem task e revisao
- o projeto ganha previsibilidade de stack desde o inicio
