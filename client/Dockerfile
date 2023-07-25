FROM node:16-buster-slim AS development
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY package*.json ./
RUN npm install --force
EXPOSE 3000
CMD ["npm", "start"]


FROM development AS build
ARG API_URL
ENV REACT_APP_API_URL=$API_URL
ENV NODE_ENV=production
COPY . .
RUN npm run build


FROM nginx:1.23 AS production
WORKDIR /usr/share/nginx/html
EXPOSE 80
COPY --from=build /app/build/ ./
