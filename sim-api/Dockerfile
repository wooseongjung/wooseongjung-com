FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server.js ./
COPY data ./data

EXPOSE 8080
CMD ["node", "server.js"]
