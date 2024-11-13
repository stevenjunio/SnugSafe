FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
RUN npm run build
# Use a static file server that supports SPA routing
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "5173"]