FROM node:14-alpine as build
ENV API=http://localhost:9000/api
WORKDIR /usr/src/app
COPY . .
ARG STAGE
RUN npm install
RUN npm run build:${STAGE}

FROM nginx:1.21-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 3000
