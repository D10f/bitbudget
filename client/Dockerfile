FROM node:16-buster-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.21 AS production
COPY --from=build /app/build/ /usr/share/nginx/html