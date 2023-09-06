FROM node:alpine@sha256:c843f4a4060246a25f62c80b3d4cf4a6b4c4639cdce421e4f2ee3102257225b4 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:c843f4a4060246a25f62c80b3d4cf4a6b4c4639cdce421e4f2ee3102257225b4

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
