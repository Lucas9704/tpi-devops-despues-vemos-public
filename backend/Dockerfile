FROM node:16.4-alpine as build
WORKDIR /usr/src/app
COPY . .
RUN echo -e "104.16.21.35 registry.npmjs.org" >> /etc/hosts
RUN npm install
CMD ["npm", "start"]

FROM nginx:1.21-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/ /usr/share/nginx/html
EXPOSE 9000
