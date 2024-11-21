FROM node:22-alpine
ARG DB_HOST=db

ENV key=${DB_HOST}


# Install wget and postgresql-client
RUN apk add --no-cache wget postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000

# Create a script to wait for DB and run migrations
COPY <<EOF /app/entrypoint.sh
#!/bin/sh
set -e

echo "Waiting for database to be ready..."
while ! pg_isready -h ${DB_HOST} -U postgres; do
    sleep 1
done

echo "Database is ready! Running migrations..."
npx prisma db push

echo "Starting application..."
exec npm run dev
EOF

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]