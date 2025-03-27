FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .
EXPOSE 1337

CMD ["node", "app.js"]
