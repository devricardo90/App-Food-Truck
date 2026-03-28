# Estrategia Oficial de Autenticacao

## Objetivo

Definir a estrategia oficial de autenticacao do MVP do Foodtrucks para mobile, web e backend, com baixo atrito de implementacao e base consistente para autorizacao posterior.

## Decisao principal

O provider principal do MVP sera o **Clerk**.

## Motivo da escolha

- atende bem mobile e web com o mesmo provedor
- reduz custo de implementar auth do zero
- acelera login, sessao e gerenciamento basico de identidade
- permite integrar autenticacao ao backend por validacao de token
- encaixa bem no momento atual do projeto, que ainda esta na fase de definicao estrutural

## Escopo da decisao

Esta task define:

- provider principal
- fluxo de autenticacao no mobile
- fluxo de autenticacao no web admin
- forma prevista de integracao com o backend

Esta task nao define ainda:

- matriz final de roles e permissoes
- guards detalhados por endpoint
- regras completas de RBAC
- implementacao tecnica nos apps

Esses pontos ficam para:

- `FT-015` roles e permissoes
- `FT-016` integracao auth no backend

## Modelo de identidade do MVP

### Entidade de identidade

O usuario possui identidade primaria no Clerk.

Campos principais esperados no dominio:

- `auth_provider`: `clerk`
- `auth_user_id`: identificador externo do Clerk
- `email`
- `phone` quando aplicavel

### Entidade de dominio local

Mesmo com Clerk como provedor, o sistema deve manter um registro local de usuario no backend para relacionar:

- pedidos
- barracas
- equipe da barraca
- gestao central
- historico operacional

Regra:

- Clerk e autoridade de autenticacao
- backend e autoridade do dominio

## Fluxo mobile

### Objetivo

Permitir que o cliente entre de forma rapida e confiavel no app.

### Fluxo definido

1. usuario abre o app
2. app oferece login e cadastro via Clerk
3. Clerk autentica o usuario
4. app recebe sessao valida
5. app usa token da sessao para chamar o backend
6. backend resolve ou cria o usuario de dominio local

### Requisitos do MVP

- login por email como base
- possibilidade de social login como opcional futuro, nao obrigatorio no primeiro corte
- sessao persistente no app
- logout explicito disponivel

## Fluxo web admin

### Objetivo

Permitir login seguro para operador da barraca e gestao central.

### Fluxo definido

1. usuario acessa o painel admin
2. painel redireciona para autenticacao Clerk quando necessario
3. Clerk autentica o usuario
4. painel recebe sessao valida
5. painel consome backend com token da sessao
6. backend identifica usuario e aplica regras de acesso do dominio

### Requisitos do MVP

- login por email como base
- sessao segura no web
- protecao de rotas autenticadas
- possibilidade futura de separar experiencias por perfil sem trocar de provedor

## Integracao prevista com backend

### Regra principal

O backend nao autentica usuario com senha propria no MVP.

O backend valida a identidade emitida pelo Clerk.

### Fluxo previsto

1. cliente mobile ou web envia token de sessao
2. backend valida token e assinatura conforme integracao oficial do Clerk
3. backend extrai `auth_user_id`
4. backend faz lookup do usuario local
5. backend cria ou sincroniza registro local quando necessario
6. backend injeta contexto autenticado para autorizacao posterior

### Resultado esperado

- uma unica fonte de autenticacao
- backend desacoplado de login manual
- base pronta para RBAC na task seguinte

## Regras de seguranca

- backend nunca confia em dados de perfil enviados pelo frontend sem validar o token
- credenciais nao ficam sob responsabilidade do backend do MVP
- rotas autenticadas exigem token valido
- usuario sem registro local resolvivel nao recebe acesso operacional automaticamente

## Estrategia de onboarding de usuario local

No primeiro acesso autenticado:

1. token do Clerk e validado
2. backend procura usuario por `auth_user_id`
3. se nao existir, cria registro local minimo
4. relacionamento com barraca, equipe ou plataforma sera tratado pelas regras de dominio e roles

## Limites conscientes do MVP

- sem provedor proprio de senha
- sem SSO corporativo
- sem federacao enterprise
- sem auth multi-provider complexa no primeiro corte
- sem fluxo avançado de delegacao administrativa neste momento

## Riscos e mitigacoes

### 1. Dependencia de provedor externo

Risco:

- autenticacao depende do Clerk

Mitigacao:

- manter modelo de usuario local no backend
- isolar integracao por camada clara

### 2. Mistura entre autenticacao e autorizacao

Risco:

- liberar acesso demais so porque o usuario esta autenticado

Mitigacao:

- separar claramente auth de RBAC
- deixar permissoes para `FT-015`

### 3. Divergencia entre usuario Clerk e usuario local

Risco:

- token valido sem contexto de dominio correto

Mitigacao:

- sincronizacao minima no primeiro acesso
- validacao obrigatoria de vinculos no backend

## Criterio de sucesso

Esta estrategia esta correta quando:

- existe um provider principal claro
- mobile tem fluxo definido
- web tem fluxo definido
- backend tem integracao prevista de forma coerente
- o projeto fica pronto para evoluir para roles e permissao sem retrabalho de auth
