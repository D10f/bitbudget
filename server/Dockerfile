### STAGING

FROM node:16-buster as staging

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build && \
    mv .env dist

CMD ["node", "dist/main"]