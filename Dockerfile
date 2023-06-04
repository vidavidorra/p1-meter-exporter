FROM node:alpine@sha256:59ac6536ba03469adc3847f23a4f223b0418fba21c90168d703f61bd84125989 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:59ac6536ba03469adc3847f23a4f223b0418fba21c90168d703f61bd84125989

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
