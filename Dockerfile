# ─── Stage 1: build ─────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Instalar todas las deps (incluyendo devDeps para poder compilar)
COPY package*.json ./
RUN npm ci

# Compilar TypeScript → dist/  (tsc copia los JSON de mappings automáticamente)
COPY . .
RUN npm run build

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

# Solo deps de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar solo el output compilado
COPY --from=builder /app/dist ./dist

# Apuntar el catálogo al JSON copiado dentro de dist/
# (el default del código busca src/domain/mappings/... que no existe en esta imagen)
ENV CATALOGO_FILE_PATH=/app/dist/domain/mappings/catalogo.sadar.json

# Puerto informativo; Render inyecta su propio PORT en tiempo de ejecución
EXPOSE 3000

# Correr como usuario no-root
USER node

CMD ["node", "dist/main.js"]
