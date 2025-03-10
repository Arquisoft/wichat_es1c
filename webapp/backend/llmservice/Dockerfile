FROM node:20

WORKDIR /app

COPY ../../package*.json ./
COPY . .

RUN npm install

EXPOSE 8003

CMD ["node", "chatbot.js"]
