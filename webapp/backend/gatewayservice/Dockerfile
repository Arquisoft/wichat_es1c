# Usa la imagen oficial de Node.js
FROM node:20

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación
COPY package*.json ./
COPY . .

# Instala dependencias
RUN npm install

# Expone el puerto del Gateway
EXPOSE 8000

# Comando para iniciar el API Gateway
CMD ["node", "server.js"]
