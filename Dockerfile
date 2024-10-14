# Usa Node.js 18 come immagine di base
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install

# Copia tutti i file di progetto
COPY . .

# Esporta la porta dell'applicazione
EXPOSE 10000

# Definisci il comando di avvio
CMD ["npm", "start"]

