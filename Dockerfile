FROM node:alpine@sha256:49623842709a1b74fa33eeacfc819a3bd48ddecf3e20166bbe56a918bba5e34a as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:49623842709a1b74fa33eeacfc819a3bd48ddecf3e20166bbe56a918bba5e34a

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
