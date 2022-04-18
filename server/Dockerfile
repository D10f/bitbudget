FROM node:16-buster-slim AS base
EXPOSE 80
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci && \
    npm cache clean --force

FROM base AS development
ENV NODE_ENV=development
COPY . .
RUN npm install --development
CMD ["nest", "start", "--debug", "--watch"]

FROM development AS test
ENV NODE_ENV=test
CMD ["jest"]

FROM development AS builder
RUN nest build

FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/dist/ /app
RUN apt-get update && \
    apt-get install tini --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
USER node
HEALTHCHECK CMD curl -f http://localhost/healthz || exit 1
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "main.js"]