FROM node:alpine@sha256:1c411f88868d97e206a5fdb78cbcee49add59022ecf1f52d54f15e1d4518c5c2 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:1c411f88868d97e206a5fdb78cbcee49add59022ecf1f52d54f15e1d4518c5c2

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
