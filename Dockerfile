FROM node:alpine@sha256:665e0ea60f46c1447077ff0b2f2e6fec4b2e1e5a77291790b50d29539f32ba0a as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:665e0ea60f46c1447077ff0b2f2e6fec4b2e1e5a77291790b50d29539f32ba0a

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
