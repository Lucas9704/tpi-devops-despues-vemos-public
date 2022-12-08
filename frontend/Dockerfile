FROM node:lts-alpine as build

ENV API=http://localhost:9000/api

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 3000
