FROM node:alpine@sha256:82c93cef3d2acbb2557c5fda48214fbc2bf5385edfb4d96d990690d75ddabf7b as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:82c93cef3d2acbb2557c5fda48214fbc2bf5385edfb4d96d990690d75ddabf7b

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
