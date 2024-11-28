FROM node:alpine

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

COPY ../.env .
 
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm run seed

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/main.js"]
