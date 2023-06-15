FROM node:alpine@sha256:0a8a2a280f1220df46e66abbf4352e4bb0a474a40c3d29f3e99775d13f6ea1ee as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:0a8a2a280f1220df46e66abbf4352e4bb0a474a40c3d29f3e99775d13f6ea1ee

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
