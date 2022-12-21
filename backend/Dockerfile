FROM node:lts as build
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD node server.js
EXPOSE 9000
