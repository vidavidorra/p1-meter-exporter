FROM node:alpine@sha256:92701a26dafc0e33c87fc245537b39af27da2be9736c84ed4f6f100c7d7194b0 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:92701a26dafc0e33c87fc245537b39af27da2be9736c84ed4f6f100c7d7194b0

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
