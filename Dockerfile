FROM node:8-slim
MAINTAINER qasim@zaidi.me

WORKDIR /usr/src/app

COPY *.json ./
RUN npm install

COPY public public
COPY src src
RUN ./src/bin/minify
EXPOSE 3786
CMD ["npm", "start"]
