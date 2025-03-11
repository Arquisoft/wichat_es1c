# Usa una imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Instala todas las dependencias
RUN npm ci

# Expone los puertos usados por los microservicios y el frontend
EXPOSE 3000 8000 8001 8002 8003 8010

# Comando para ejecutar la aplicación completa con `concurrently`
CMD ["npm", "run", "dev"]
