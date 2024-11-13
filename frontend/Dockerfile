# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Set environment variables
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage with Caddy
FROM caddy:2.8.4-alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/caddy

# Copy and format Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt --overwrite /etc/caddy/Caddyfile

# Expose ports
EXPOSE 80 443

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]