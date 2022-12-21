FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY /build .

FROM nginx:1.21-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 3000
