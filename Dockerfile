FROM node:alpine@sha256:a329b146bcc99a36caa73056e60714d0911ca5c229ade3eb27e9283dc78c9eb6 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:a329b146bcc99a36caa73056e60714d0911ca5c229ade3eb27e9283dc78c9eb6

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
