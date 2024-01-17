FROM node:alpine@sha256:ab620cffd0f4d4529ef97682b2309c0571cd14a75496aa0934a13b059d003647 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts
RUN npm run build

FROM node:alpine@sha256:ab620cffd0f4d4529ef97682b2309c0571cd14a75496aa0934a13b059d003647

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./
COPY LICENSE.md README.md ./
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --only=production
CMD ["node", "--enable-source-maps", "/app/dist/index.js"]
