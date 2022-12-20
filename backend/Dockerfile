FROM node:16.4 as build
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "start"]

FROM nginx:1.21-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/ /usr/share/nginx/html
EXPOSE 9000
