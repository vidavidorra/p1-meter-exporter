FROM node:alpine@sha256:d75175d449921d06250afd87d51f39a74fc174789fa3c50eba0d3b18369cc749 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:d75175d449921d06250afd87d51f39a74fc174789fa3c50eba0d3b18369cc749

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
