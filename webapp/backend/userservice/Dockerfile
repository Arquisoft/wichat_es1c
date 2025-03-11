FROM node:20

WORKDIR /app

COPY ../../package*.json ./
COPY . .

RUN npm install

EXPOSE 8001

CMD ["node", "userservice.js"]
