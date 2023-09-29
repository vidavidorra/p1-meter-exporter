FROM node:alpine@sha256:6f52984eb7b7c371718f204e0badf77d8bbb86f33a95d8908d5b73dafbfbb7dc as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:6f52984eb7b7c371718f204e0badf77d8bbb86f33a95d8908d5b73dafbfbb7dc

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
