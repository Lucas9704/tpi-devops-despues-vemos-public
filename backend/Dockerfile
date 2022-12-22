FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
COPY /dist ./dist
CMD npm start
EXPOSE 9000