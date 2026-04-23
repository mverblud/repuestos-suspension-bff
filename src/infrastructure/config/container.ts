import { createContainer, asClass, asValue, InjectionMode, type AwilixContainer } from 'awilix';
import { ProductoScraperAdapter } from '../adapters/ProductoScraperAdapter';
import { ObtenerProductosSuspensionUseCase } from '../../application/use-cases/ObtenerProductosSuspensionUseCase';
import { ProductosController } from '../http/controllers/ProductosController';

interface Cradle {
  scraperBaseUrl: string;
  productoRepository: ProductoScraperAdapter;
  obtenerProductosUseCase: ObtenerProductosSuspensionUseCase;
  productosController: ProductosController;
}

export function buildContainer(): AwilixContainer<Cradle> {
  const container = createContainer<Cradle>({ injectionMode: InjectionMode.PROXY });

  container.register({
    scraperBaseUrl: asValue(process.env.SCRAPER_BASE_URL ?? 'http://localhost:3001'),
    productoRepository: asClass(ProductoScraperAdapter).singleton(),
    obtenerProductosUseCase: asClass(ObtenerProductosSuspensionUseCase).singleton(),
    productosController: asClass(ProductosController).singleton(),
  });

  return container;
}
