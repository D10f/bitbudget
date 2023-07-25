# FROM node:16-buster-slim AS base
# FROM node:16-bullseye-slim AS base
FROM node:18-bookworm-slim AS base
EXPOSE 80
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci && \
  npm cache clean --force

FROM base AS development
ENV NODE_ENV=development
RUN npm install --development
COPY . .
CMD ["nest", "start", "--debug", "--watch"]

FROM development AS test
ENV NODE_ENV=test
CMD ["jest"]

FROM development AS builder
RUN nest build

FROM base AS production
# Copy seed script and install required dependencies
COPY src/seed.js .
RUN npm install -D moment axios minifaker mongodb

ENV NODE_ENV=production
COPY --from=builder /app/dist .

RUN apt-get update && \
  apt-get install tini --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
USER node
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "main.js"]
