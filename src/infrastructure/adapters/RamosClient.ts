import { request } from 'undici';
import type { BuscarProductosParams, RamosScraperResponse } from '../../domain/models/Producto';
import type { IAuthService } from '../../application/ports/IAuthService';
import type { RamosProductoRaw } from './mappers/productoRamosMapper';

interface RamosResponse {
  params: unknown;
  totalProductos: number;
  productos: RamosProductoRaw[];
}

export class RamosClient {
  private readonly baseUrl: string;
  private readonly authService: IAuthService;

  constructor({ ramosBaseUrl, ramosAuthService }: { ramosBaseUrl: string; ramosAuthService: IAuthService }) {
    this.baseUrl = ramosBaseUrl;
    this.authService = ramosAuthService;
  }

  async buscarProductos(params: BuscarProductosParams): Promise<RamosProductoRaw[]> {
    const token = await this.authService.getToken();
    const { body } = await request(`${this.baseUrl}/scraper/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    const response = (await body.json()) as RamosResponse;
    return response.productos;
  }

  async buscarProductosCrudo(params: BuscarProductosParams): Promise<RamosScraperResponse> {
    const token = await this.authService.getToken();
    const { body } = await request(`${this.baseUrl}/scraper/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    return (await body.json()) as RamosScraperResponse;
  }
}
