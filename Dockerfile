FROM node:alpine@sha256:6e56967f8a4032f084856bad4185088711d25b2c2c705af84f57a522c84d123b as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:6e56967f8a4032f084856bad4185088711d25b2c2c705af84f57a522c84d123b

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
