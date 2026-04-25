# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # ts-node-dev con hot reload
npm run build        # tsc -p tsconfig.build.json → dist/
npm start            # node dist/main.js
npm test             # jest (todas las suites)
npm test -- --testPathPattern=ProductoScraperAdapter  # un solo spec
npm run test:watch   # jest en modo watch
npm run lint         # eslint src/
npm run lint:fix     # eslint src/ --fix
```

## Architecture

BFF hexagonal con tres capas:

**Domain** (`src/domain/models/`) — interfaces puras sin dependencias: `Producto` y `BuscarProductosParams`.

**Application** (`src/application/`) — puertos y casos de uso:
- `ports/IProductoRepository.ts` — port out (driven): contrato hacia infraestructura
- `ports/IObtenerProductosUseCase.ts` — port in (driving): contrato hacia HTTP
- `use-cases/` — implementaciones de los ports in, dependen solo de ports out vía constructor

**Infrastructure** (`src/infrastructure/`) — detalles técnicos:
- `adapters/` — implementan ports out; `ProductoScraperAdapter` llama al scraper externo via `undici`
- `http/controllers/` — reciben el request de Fastify, llaman al use case, devuelven respuesta
- `http/routes/` — registran rutas en la instancia de Fastify
- `config/container.ts` — único lugar donde se construye el grafo de dependencias con Awilix

## Dependency Injection

Awilix en modo **PROXY**. Todos los constructores reciben un único objeto desestructurado:

```ts
constructor({ productoRepository }: { productoRepository: IProductoRepository }) { ... }
```

Los nombres de las propiedades deben coincidir exactamente con las claves registradas en `container.ts`. Al agregar un nuevo componente: registrarlo en el `Cradle` interface y en `container.register({...})`.

## Adding a new use case

1. Model/params en `src/domain/models/` si es un dominio nuevo
2. Port out en `src/application/ports/I<Repo>.ts`
3. Port in en `src/application/ports/I<UseCase>.ts`
4. Use case en `src/application/use-cases/<NombreUseCase>.ts`; test en `test/application/use-cases/<NombreUseCase>.spec.ts`
5. Adapter en `src/infrastructure/adapters/<Nombre>Adapter.ts`; test en `test/infrastructure/adapters/<Nombre>Adapter.spec.ts`
6. Controller + route en `src/infrastructure/http/`
7. Registrar todo en `src/infrastructure/config/container.ts`

## Environment

```
PORT=3000                              # default 3000
SCRAPER_BASE_URL=http://localhost:3001 # scraper externo
```

Copiar `.env.example` → `.env` antes de correr. El scraper externo expone `POST /scraper/productos` con body `{ codigoAuto, marcaId, rubroId, cantidadRenglones }`.

## TypeScript config

- `tsconfig.json` — incluye spec files (para ts-jest e IDE)
- `tsconfig.build.json` — excluye `*.spec.ts` y `jest.config.ts` (usado por `npm run build`)
