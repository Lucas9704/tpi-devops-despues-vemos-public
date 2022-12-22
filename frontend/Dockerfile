FROM nginx:1.21-alpine
WORKDIR /usr/src/app
COPY /build .
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
EXPOSE 3000
