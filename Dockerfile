FROM node:alpine@sha256:a369136b6f7640f85acf300ce9d6498d8161972b855a72bbc79273150d4dd0c7 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:a369136b6f7640f85acf300ce9d6498d8161972b855a72bbc79273150d4dd0c7

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
