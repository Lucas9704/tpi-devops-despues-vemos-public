FROM node:lts-alpine as build

WORKDIR /app 

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

COPY --from=build /app/dist ./build

CMD ["node", "build/final.js"]

EXPOSE 9000
