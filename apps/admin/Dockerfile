FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable

COPY package.json tsconfig.json tsconfig.base.json next.config.ts postcss.config.mjs proxy.ts ./
COPY app ./app
COPY src ./src
COPY next-env.d.ts ./

RUN pnpm install --no-frozen-lockfile
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-lc", "pnpm start"]
