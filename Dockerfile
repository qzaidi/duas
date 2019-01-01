from node:8-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN ./bin/minify
EXPOSE 3786
CMD ["npm", "start"]
