FROM node:alpine@sha256:d9d53500783a153234cc47d89a2f9117d1ed4eadf29cbeb46c377d172348aa73 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:d9d53500783a153234cc47d89a2f9117d1ed4eadf29cbeb46c377d172348aa73

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
