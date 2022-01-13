FROM node:16-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && \
    mv .env dist && \
    find . -maxdepth 1 ! -name 'dist' -exec rm -rf {} +

EXPOSE 3000

CMD ["node", "dist/main"]