FROM node:alpine@sha256:f62abc08fe1004555c4f28b6793af8345a76230b21d2d249976f329079e2fef2 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:f62abc08fe1004555c4f28b6793af8345a76230b21d2d249976f329079e2fef2

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
