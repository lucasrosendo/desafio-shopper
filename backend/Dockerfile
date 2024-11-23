FROM node:alpine

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

COPY ../.env .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/main.js"]
