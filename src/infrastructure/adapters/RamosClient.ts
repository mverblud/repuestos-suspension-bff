import { request } from 'undici';
import type { BuscarProductosParams } from '../../domain/models/Producto';
import type { RamosProductoRaw } from './mappers/productoRamosMapper';

interface RamosResponse {
  params: unknown;
  totalProductos: number;
  productos: RamosProductoRaw[];
}

export class RamosClient {
  private readonly baseUrl: string;

  constructor({ ramosBaseUrl }: { ramosBaseUrl: string }) {
    this.baseUrl = ramosBaseUrl;
  }

  async buscarProductos(params: BuscarProductosParams): Promise<RamosProductoRaw[]> {
    const { body } = await request(`${this.baseUrl}/scraper/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const response = (await body.json()) as RamosResponse;
    return response.productos;
  }
}
