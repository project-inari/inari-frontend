FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

#==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.output ./

EXPOSE 3000
CMD ["node", "server/index.mjs"]
