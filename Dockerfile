FROM node:alpine@sha256:49f1c207f12f52e7dd4878e1c10a911c05ed7f534e6526b879ddc6dabed058f6 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:49f1c207f12f52e7dd4878e1c10a911c05ed7f534e6526b879ddc6dabed058f6

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
