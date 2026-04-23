import { request } from 'undici';
import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';
import type { IProductoRepository } from '../../application/ports/IProductoRepository';

export class ProductoScraperAdapter implements IProductoRepository {
  private readonly scraperBaseUrl: string;

  constructor({ scraperBaseUrl }: { scraperBaseUrl: string }) {
    this.scraperBaseUrl = scraperBaseUrl;
  }

  async obtenerProductos(params: BuscarProductosParams): Promise<Producto[]> {
    const { body } = await request(`${this.scraperBaseUrl}/scraper/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return body.json() as Promise<Producto[]>;
  }
}
