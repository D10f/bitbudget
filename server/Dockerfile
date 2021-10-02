FROM node:16-buster-slim as base

LABEL org.opencontainers.image.authors=sojourn@pm.me
LABEL org.opencontainers.image.title="Pawn's Guard"
LABEL org.opencontainers.image.license=MIT

# Review this one later!
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV NODE_ENV production
ENV TINI_VERSION v0.19.0

EXPOSE 8080

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config list
RUN npm ci --only=production \
    && npm cache clean --force

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT [ "/tini", "--" ]
CMD [ "node", "server.js" ]

# Development Image
# NOTE: You must run "npm install" once in your local machine before running docker-compose up
#####################
FROM base as dev

ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV development

RUN npm config list
RUN npm install --only=development \
    && npm cache clean --force

USER node
CMD [ "nodemon", "server.js" ]

# Test Image
#####################
FROM dev as vulnscan
USER root
COPY . .
COPY --from=aquasec/trivy:latest /usr/local/bin/trivy /usr/local/bin/trivy
RUN npm audit \
    && trivy filesystem --exit-code 1 --no-progress .

# Intermediate Build Image
# NOTE: Used to remove files that are unnecessary on the production image
#####################
FROM vulnscan as preprod
RUN rm -rf ./node_modules \
            /usr/local/bin/trivy

# Production Image
#####################
FROM preprod as prod
COPY --from=preprod /usr/src/app /usr/src/app
HEALTHCHECK CMD curl http://127.0.0.1/ || exit 1
USER node
