FROM node:22-alpine
RUN echo "hello worlds from the client"
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]