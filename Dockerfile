FROM node:alpine@sha256:53741c7511b1836b5eb7e788a7b399c058b0b549f205d2c6af831ec1a9a81c31 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:53741c7511b1836b5eb7e788a7b399c058b0b549f205d2c6af831ec1a9a81c31

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
