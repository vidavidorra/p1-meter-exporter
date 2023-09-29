FROM node:alpine@sha256:a348d50e74df20fa8c572c3abf80b89ae4daf9c312523c49a42997284d13ebac as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:a348d50e74df20fa8c572c3abf80b89ae4daf9c312523c49a42997284d13ebac

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
