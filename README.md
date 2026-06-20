# repuestos-suspension-bff

BFF (Backend for Frontend) para el dominio de repuestos de suspensión.
Construido con **Fastify**, **TypeScript** y arquitectura hexagonal.
Agrega datos de dos fuentes externas (Ramos y ASM) y expone el catálogo Sadar.

---

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) ≥ 24

---

## Docker — build y ejecución local

### 1. Build de la imagen

```bash
docker build -t repuestos-suspension-bff .
```

### 2. Correr el contenedor

El BFF corre en el puerto 3005 y consume dos servicios externos. El puerto por defecto en `.env` es `3005`.

```bash
docker run --rm -p 3005:3005 \
  -e PORT=3005 \
  -e RAMOS_BASE_URL=http://tu-ramos-host:3001 \
  -e RM_USERNAME=admin \
  -e RM_PASSWORD=tu_password \
  -e ASM_BASE_URL=http://tu-asm-host:3000 \
  -e ASM_USERNAME=user \
  -e ASM_PASSWORD=tu_password \
  repuestos-suspension-bff
```

La app queda disponible en `http://localhost:3005`.

#### Servicios externos corriendo en la misma máquina (Mac)

Si los servicios de Ramos (3001) y ASM (3000) corren localmente, **no uses `localhost`** dentro del contenedor — apunta al host con `host.docker.internal`:

```bash
docker run --rm -p 3005:3005 \
  -e PORT=3005 \
  -e RAMOS_BASE_URL=http://host.docker.internal:3001 \
  -e RM_USERNAME=admin \
  -e RM_PASSWORD=tu_password \
  -e ASM_BASE_URL=http://host.docker.internal:3000 \
  -e ASM_USERNAME=user \
  -e ASM_PASSWORD=tu_password \
  repuestos-suspension-bff
```

> `localhost` dentro del contenedor apunta al contenedor mismo, no a tu Mac.
> `host.docker.internal` es el nombre DNS especial de Docker para Mac que resuelve al host.

### 3. Verificar que levantó

```bash
curl http://localhost:3005/health
# → {"status":"ok"}
```

---

## Variables de entorno

| Variable            | Default en imagen                                          | Descripción                                         |
|---------------------|------------------------------------------------------------|-----------------------------------------------------|
| `PORT`              | `3005`                                                     | Puerto en el que escucha el servidor                |
| `NODE_ENV`          | `production` (fijado en el Dockerfile)                     | Modo de ejecución; activa logger JSON en producción |
| `RAMOS_BASE_URL`    | `http://localhost:3001`                                    | URL base del servicio Ramos                         |
| `RM_USERNAME`       | *(vacío)*                                                  | Usuario para autenticación en Ramos                 |
| `RM_PASSWORD`       | *(vacío)*                                                  | Contraseña para autenticación en Ramos              |
| `ASM_BASE_URL`      | `http://localhost:3000`                                    | URL base del servicio ASM                           |
| `ASM_USERNAME`      | *(vacío)*                                                  | Usuario para autenticación en ASM                   |
| `ASM_PASSWORD`      | *(vacío)*                                                  | Contraseña para autenticación en ASM                |
| `CATALOGO_FILE_PATH`| `/app/dist/domain/mappings/catalogo.sadar.json` (en imagen)| Ruta absoluta al JSON del catálogo Sadar            |

> `PORT` y `CATALOGO_FILE_PATH` **no** hace falta setearlos en Render (ver abajo).

---

## Endpoints principales

| Método | Path                    | Descripción                               |
|--------|-------------------------|-------------------------------------------|
| GET    | `/health`               | Health check (devuelve `{"status":"ok"}`) |
| GET    | `/productos`            | Buscar productos de suspensión            |
| GET    | `/rubros`               | Listar rubros disponibles                 |
| GET    | `/autos`                | Listar autos/modelos                      |
| GET    | `/catalogo`             | Listar catálogo Sadar completo            |
| GET    | `/catalogo/:codigo`     | Obtener parte por código                  |
| POST   | `/catalogo`             | Crear parte en el catálogo                |
| PUT    | `/catalogo/:codigo`     | Actualizar parte del catálogo             |
| DELETE | `/catalogo/:codigo`     | Eliminar parte del catálogo               |

---

## Deploy en Render (free tier)

1. **New → Web Service** → conectar el repositorio de GitHub.
2. **Runtime**: Docker (Render detecta el `Dockerfile` automáticamente).
3. **Plan**: Free.
4. **Health Check Path**: `/health`.
5. **Variables de entorno** — cargar en el dashboard de Render:
   - `RAMOS_BASE_URL`, `RM_USERNAME`, `RM_PASSWORD`
   - `ASM_BASE_URL`, `ASM_USERNAME`, `ASM_PASSWORD`
   - `NODE_ENV=production` (opcional, ya viene en el Dockerfile)
   - **No setear `PORT`** — Render lo inyecta automáticamente.
   - **No setear `CATALOGO_FILE_PATH`** — ya viene configurado en el Dockerfile.
6. Deploy.

### Caveats del free tier

- **Filesystem efímero**: los cambios al catálogo realizados vía las rutas POST/PUT/DELETE
  se guardan en el archivo JSON dentro del contenedor. Esos cambios **se pierden**
  con cada redeploy, reinicio o spin-down del servicio. Para persistencia real
  se necesitaría una base de datos o disco persistente (no disponible en el plan free).
- **Spin-down por inactividad**: el servicio se duerme tras ~15 minutos sin tráfico.
  El primer request posterior tiene un cold start de varios segundos.

---

## Desarrollo local (sin Docker)

```bash
cp .env.example .env   # completar las variables
npm install
npm run dev            # hot-reload con ts-node-dev
```

```bash
npm test               # suite completa
npm run lint           # linting
npm run build          # compilar a dist/
```
