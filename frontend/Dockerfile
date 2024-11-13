# Build stage
FROM node:22-alpine AS builder

ARG VITE_CORBADO_PROJECT_ID
ARG VITE_SERVER_URL
ARG VITE_S3_ENDPOINT
ARG VITE_S3_ACCESS_KEY_ID
ARG VITE_S3_SECRET_ACCESS_KEY
ARG VITE_CORBADO_FRONTEND_API_URL

WORKDIR /app

# Set environment variables
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    VITE_CORBADO_PROJECT_ID=${VITE_CORBADO_PROJECT_ID} \
    VITE_SERVER_URL=${VITE_SERVER_URL} \
    VITE_S3_ENDPOINT=${VITE_S3_ENDPOINT} \
    VITE_S3_ACCESS_KEY_ID=${VITE_S3_ACCESS_KEY_ID} \
    VITE_S3_SECRET_ACCESS_KEY=${VITE_S3_SECRET_ACCESS_KEY} \
    VITE_CORBADO_FRONTEND_API_URL=${VITE_CORBADO_FRONTEND_API_URL}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .


ENV VITE_CORBADO_PROJECT_ID=${VITE_CORBADO_PROJECT_ID}
# Build the application
RUN npm run build

# Production stage with Caddy
FROM caddy:2.8.4-alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /srv

# Copy and format Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt --overwrite /etc/caddy/Caddyfile

# Expose ports
EXPOSE 80 443

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]