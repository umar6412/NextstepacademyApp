"""Dockerfile for the frontend Next.js application.
"""
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm","run","start"]
