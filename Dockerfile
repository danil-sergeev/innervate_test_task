FROM node:8.10.0-alpine

COPY . /usr/app
WORKDIR /usr/app

RUN npm install 

EXPOSE 3000

COPY . .
CMD [ "npm", "run", "server" ]