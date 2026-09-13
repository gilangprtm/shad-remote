# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run publish:local

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/scripts/serve-deploy.mjs ./scripts/serve-deploy.mjs
COPY --from=build /app/deploy ./deploy

EXPOSE 3000

USER node

CMD ["node", "scripts/serve-deploy.mjs"]
