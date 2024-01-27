FROM node:alpine@sha256:a8beafd69068c05d09183e75b9aa679b520ba68f94b19c90d0da9f307f9f6565 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:a8beafd69068c05d09183e75b9aa679b520ba68f94b19c90d0da9f307f9f6565

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
