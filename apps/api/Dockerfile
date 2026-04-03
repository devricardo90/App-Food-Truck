FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

COPY package.json tsconfig.json tsconfig.base.json tsconfig.build.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN pnpm install --no-frozen-lockfile
RUN printf "DATABASE_URL=%s\n" "postgresql://postgres:postgres@127.0.0.1:5432/railway" > .env
RUN pnpm prisma:generate
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-lc", "pnpm prisma:migrate:deploy && pnpm start"]
