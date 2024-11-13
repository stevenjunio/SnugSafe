# Define the build argument
ARG NODE_ENV=production

# Base image
FROM node:22-alpine
ENV NODE_ENV=production


WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5173

# Use shell conditional for different behaviors
RUN if [ "$NODE_ENV" = "production" ]; then \
        npm run build; \
    else \
        echo "Development mode - skipping build"; \
    fi

# Conditional CMD based on environment
CMD if [ "$NODE_ENV" = "production" ]; then \
        npm run start; \
    else \
        npm run dev -- --host; \
    fi