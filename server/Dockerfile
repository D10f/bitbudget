FROM node:16-buster AS base
WORKDIR /usr/src/app
EXPOSE 3000
COPY package*.json ./
RUN npm install --production
COPY . .

FROM base AS builder
RUN npm install --development && \
    npm run build && \
    mv package*.json dist

FROM base as production
ENV NODE_ENV=production
COPY --from=builder --chown=1000:1000 /usr/src/app/dist ./
RUN npm cache clean --force
USER node
# ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "main.js"]

FROM base as development
ENV NODE_ENV=development
RUN npm install --development
CMD ["node_modules/@nestjs/cli/bin/nest.js", "start", "--watch"]

FROM development as test
CMD ["npm", "test"]