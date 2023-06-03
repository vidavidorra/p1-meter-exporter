FROM node:alpine@sha256:f3fe00fbf0cd0660487f3133a2a4bf16d0778198fdc94a08eb6558ebf9c39f57 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:f3fe00fbf0cd0660487f3133a2a4bf16d0778198fdc94a08eb6558ebf9c39f57

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
