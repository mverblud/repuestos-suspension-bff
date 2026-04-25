import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';
import type { IRamosProductoRepository } from '../../application/ports/IRamosProductoRepository';
import type { RamosClient } from './RamosClient';
import { mapRamosProducto } from './mappers/productoRamosMapper';

export class RamosAdapter implements IRamosProductoRepository {
  private readonly ramosClient: RamosClient;

  constructor({ ramosClient }: { ramosClient: RamosClient }) {
    this.ramosClient = ramosClient;
  }

  async obtenerProductos(params: BuscarProductosParams): Promise<Producto[]> {
    const raw = await this.ramosClient.buscarProductos(params);
    return raw.map(mapRamosProducto);
  }
}
