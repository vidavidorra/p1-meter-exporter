FROM node:alpine@sha256:4cc2d9f365691fc6f8fe227321d32d9a2691216a71f51c21c7f02224515dea48 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:4cc2d9f365691fc6f8fe227321d32d9a2691216a71f51c21c7f02224515dea48

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
