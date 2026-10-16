# Image unique : serveur Node (API de synchronisation + fichiers statiques) et les deux apps.
#   /      accueil (home/)        /it/  italien (statique, italian/)
#   /zh/   chinois (build Vite)   /shared/  client de synchronisation commun

FROM node:24-alpine AS chinese
WORKDIR /src/chinese
COPY chinese/package.json chinese/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY shared/ /src/shared/
COPY chinese/ ./
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production PORT=8080 DB_PATH=/data/langues.db PUBLIC_DIR=/app/public
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev --no-audit --no-fund
COPY server/ ./server/
COPY home/ ./public/
COPY shared/ ./public/shared/
COPY italian/ ./public/it/
COPY --from=chinese /src/chinese/dist/ ./public/zh/
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 8080
CMD ["node", "--disable-warning=ExperimentalWarning", "server/server.js"]
