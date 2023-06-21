FROM node:alpine@sha256:77516e190b36147a51d2d1b85b52f57592fe956b1dbeea57a3d618a0affd5104 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:77516e190b36147a51d2d1b85b52f57592fe956b1dbeea57a3d618a0affd5104

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
