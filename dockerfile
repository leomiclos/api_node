# Usa imagem oficial do Node
FROM node:18

# Cria o diretório da app
WORKDIR /app

# Copia os arquivos package.json/package-lock.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Roda a API
CMD ["node", "index.js"]
