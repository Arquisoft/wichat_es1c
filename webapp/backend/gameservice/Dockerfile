FROM node:20

WORKDIR /app

COPY ../../package*.json ./
COPY . .

RUN npm install

EXPOSE 8010

CMD ["node", "question-service.js"]
