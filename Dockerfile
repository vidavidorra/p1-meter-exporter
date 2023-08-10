FROM node:alpine@sha256:80f3be1363191811dd25cc8cb966241a30555d95a082b69487435c9e09236bb7 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:80f3be1363191811dd25cc8cb966241a30555d95a082b69487435c9e09236bb7

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
