FROM node:20-alpine AS base

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM base AS development
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "--watch", "server.js"]

FROM base AS production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
