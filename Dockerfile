FROM node:alpine@sha256:4721df121cbfd0fa022ac9971ddc9e0bb1ea9abb9faa8fcac6cc1fe8cbd0246b as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:4721df121cbfd0fa022ac9971ddc9e0bb1ea9abb9faa8fcac6cc1fe8cbd0246b

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
