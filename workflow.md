# Workflow

## Regras adicionais obrigatorias

Protocolo Rick V1.0

### 1. Commits tambem existem na Fase 1

Mesmo tasks sem implementacao de feature devem gerar commit quando produzirem:

- definicao de escopo
- definicao de fluxos
- definicao de auth
- definicao de pagamentos
- definicao de notificacoes
- definicao de testes
- definicao de observabilidade
- definicao de politica de versoes

#### Regra

Nenhuma task documental estrategica pode virar `DONE` sem:

- documento salvo no repositorio
- backlog atualizado
- revisao do orquestrador
- commit aprovado

#### Exemplos de commit

- `docs(product): define mvp scope and non-goals`
- `docs(orders): define order lifecycle and transitions`
- `docs(payments): define payment lifecycle and webhook rules`
- `docs(auth): define auth strategy and role model`
- `docs(infra): define version matrix and install policy`

---

### 2. Fonte oficial de versoes

Toda dependencia critica deve obedecer a matriz oficial do projeto.

#### Arquivo fonte

- `docs/architecture/version-matrix.md`

#### Regra

- Nunca instalar dependencia critica com `latest`
- Nunca instalar versao sem validar compatibilidade
- Nunca atualizar versao critica fora de task especifica
- Se a versao nao estiver definida no `version-matrix.md`, a task deve parar e voltar para revisao

---

### 3. Ordem obrigatoria de instalacao

Toda instalacao deve seguir a ordem correta para minimizar incompatibilidades.

#### Ordem global

1. framework-base
2. ecossistema oficial compativel
3. tooling compartilhado
4. libs transversais
5. integracoes externas
6. features especificas

#### Ordem do mobile

1. Expo app base
2. fixar SDK Expo
3. instalar libs do ecossistema Expo com `npx expo install`
4. Expo Router
5. NativeWind
6. estado global
7. server state
8. forms e validacao
9. auth
10. notificacoes
11. pagamentos

#### Ordem do admin web

1. Next.js base
2. React / React DOM compativeis
3. Tailwind
4. UI kit
5. server state
6. forms e validacao
7. auth
8. features

#### Ordem da API

1. Nest base
2. config e estrutura de modulos
3. Prisma + PostgreSQL
4. Swagger
5. Scalar
6. auth
7. payments
8. notifications
9. relatorios e observabilidade

---

### 4. Regra obrigatoria para Expo

Para o ecossistema Expo:

- sempre usar `npx expo install` quando aplicavel
- nunca instalar manualmente dependencias centrais do ecossistema Expo sem checagem
- upgrades devem ser incrementais e documentados

---

### 5. Documentacao da API e obrigatoria

Toda API HTTP do projeto deve ter documentacao viva.

#### Ferramentas padrao

- Swagger
- Scalar

#### Regra

- Endpoint novo sem documentacao minima nao pode virar `DONE`
- Mudanca de contrato exige atualizacao de documentacao no mesmo ciclo
- DTO, params, query, body e response devem refletir o contrato real
- Swagger deve servir a documentacao tecnica
- Scalar deve servir a visualizacao navegavel da API

---

### 6. Regra do orquestrador antes de aprovar instalacao

Antes de aprovar qualquer task que instale ou atualize dependencias, o orquestrador deve validar:

- a versao esta no `version-matrix.md`?
- a ordem de instalacao foi respeitada?
- existe risco de compatibilidade?
- `latest` foi evitado em dependencia critica?
- houve registro documental da decisao?
- houve registro do impacto no projeto quando necessario?

Se qualquer resposta for nao, a task nao pode virar `DONE`.

---

### 7. Regra do subagente antes de instalar dependencia

O subagente executor deve:

- consultar o `version-matrix.md`
- respeitar a ordem de instalacao
- evitar `latest`
- usar `npx expo install` no ecossistema Expo quando aplicavel
- reportar qualquer incompatibilidade
- atualizar documentacao quando necessario

---

### 8. Regra de ESLint e Prettier

- ESLint deve usar versao major estavel atual `10.x`
- Prettier deve usar versao exata `3.3.0`
- Nunca usar `latest` nessas dependencias
- Prettier e responsavel por formatacao
- ESLint e responsavel por qualidade e regras

#### Integracao obrigatoria

- usar `eslint-config-prettier`
- evitar conflito entre regras
- em Next.js 16, usar ESLint CLI direto em vez de `next lint`

#### Criterio de DONE

Nenhuma task pode ser aprovada se:

- lint falhar
- typecheck falhar
- formatacao estiver inconsistente

---

### 9. Regra da API antes de DONE

Nenhuma task da API pode virar `DONE` sem verificar:

- contrato documentado
- Swagger funcional
- Scalar funcional, quando aplicavel a etapa
- coerencia entre implementacao e documentacao

---

### 10. Regra obrigatoria para Prisma

Se qualquer task alterar:

- `schema.prisma`
- models
- enums
- relations
- datasource
- generator
- migrations com impacto no client

entao, antes de commit e push, e obrigatorio:

1. rodar `prisma validate`
2. rodar `prisma generate`
3. validar se o Prisma Client foi atualizado corretamente
4. rodar `typecheck` da API
5. validar `build` da API
6. revisar se a migration foi criada ou aplicada quando necessario

Nenhuma task da API que altere Prisma pode virar `DONE` sem essa validacao.

#### Regra de versao do Prisma

- `prisma` e `@prisma/client` devem permanecer sempre na mesma versao
- baseline oficial atual: `7.4.1`
- nunca misturar versoes entre CLI e client

### Regra obrigatoria - Prisma 7 + PostgreSQL

Se a API utilizar Prisma 7 com PostgreSQL:

- e obrigatorio garantir a presenca do driver `pg`
- o pacote `pg` deve estar instalado e compativel com o Node do projeto
- nao assumir que Prisma instala o driver automaticamente

#### Dependencia obrigatoria

- `pg`

#### Regra

Antes de aprovar qualquer task relacionada a banco de dados:

1. verificar se `pg` esta instalado
2. validar se a conexao com PostgreSQL funciona
3. validar se o Prisma Client conecta corretamente
4. validar se nao ha erro de driver no runtime

Se `pg` nao estiver presente:

- bloquear a task
- solicitar instalacao antes de prosseguir

#### Criterio de DONE adicional

Nenhuma task envolvendo Prisma pode ser marcada como `DONE` sem:

- `prisma generate` executado
- conexao com banco validada
- driver `pg` presente e funcional

#### Checklist curto antes do push da API

Se mexeu em Prisma:

- `prisma validate`
- `prisma generate`
- `prisma migrate dev` ou revisao de migration
- `typecheck`
- `build`
- validar driver `pg`

#### Risco de nao gerar novamente o client

Sem `prisma generate`, a task pode quebrar:

- tipos desatualizados
- imports inconsistentes do Prisma Client
- enums faltando
- propriedades ou models novas nao reconhecidas
- build no CI
- runtime, mesmo quando o local parecia correto

#### Regra para o orquestrador e subagente

Se a task tocar Prisma ou schema do banco, e obrigatorio rodar `prisma generate` antes de marcar como `REVIEW` ou `DONE`.

Sem isso, a task nao pode ser aprovada para commit ou push.

Se a task envolver Prisma com PostgreSQL:

- garantir que o pacote `pg` esta instalado
- validar compatibilidade com Node.js do projeto
- bloquear execucao se o driver nao estiver presente

---

### 11. Criterio extra de revisao para fluxo critico

Se a task mexer em:

- pedido
- pagamento
- auth
- banco
- notificacoes
- contratos da API
- versoes centrais

a revisao deve ser mais rigida e explicita.

---

### 12. Frase operacional

Sem matriz de versao nao ha instalacao segura.  
Sem Swagger/Scalar nao ha contrato confiavel.  
Sem commit nao ha decisao consolidada.
