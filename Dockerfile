FROM node:alpine@sha256:1d34273b1b489a4e879ccfaee83c1cec99acbb5a4128f880981071e1bae62b97 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:1d34273b1b489a4e879ccfaee83c1cec99acbb5a4128f880981071e1bae62b97

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
