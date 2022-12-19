FROM node:14-alpine as build
WORKDIR /app 
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.21-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 9000
