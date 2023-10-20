FROM node:alpine@sha256:39bf945d56c29e7b3fa51632a7a07080475e5d5e5fc981543cdb735bc3bc01eb as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:39bf945d56c29e7b3fa51632a7a07080475e5d5e5fc981543cdb735bc3bc01eb

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
