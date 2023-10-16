FROM node:alpine@sha256:744436da457ddcc6d9782f74a9b9656445106271c79bf4aa0d60f20503b376aa as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:744436da457ddcc6d9782f74a9b9656445106271c79bf4aa0d60f20503b376aa

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
