foodtrucks-platform/
├─ apps/
│ ├─ mobile/ # App cliente React Native + Expo
│ ├─ admin/ # Painel web Next.js (barraca + gestão central)
│ └─ api/ # Backend NestJS
│
├─ packages/
│ ├─ ui/ # Componentes compartilhados web
│ ├─ mobile-ui/ # Componentes compartilhados mobile
│ ├─ types/ # Tipos globais compartilhados
│ ├─ schemas/ # Zod schemas compartilhados
│ ├─ config/ # Configs compartilhadas (eslint, tsconfig, env)
│ ├─ utils/ # Helpers compartilhados
│ ├─ api-client/ # SDK/fetch client para consumir a API
│ └─ constants/ # Constantes do domínio
│
├─ tooling/
│ ├─ eslint/
│ ├─ typescript/
│ └─ prettier/
│
├─ docs/
│ ├─ product/
│ ├─ architecture/
│ ├─ api/
│ ├─ flows/
│ └─ skills/
│
├─ .github/
│ └─ workflows/
│
├─ turbo.json
├─ package.json
├─ pnpm-workspace.yaml
├─ README.md
└─ .env.example
