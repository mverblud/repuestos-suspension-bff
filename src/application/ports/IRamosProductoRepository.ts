import type { BuscarProductosParams, Producto, RamosScraperResponse } from '../../domain/models/Producto';

export interface IRamosProductoRepository {
  obtenerProductos(params: BuscarProductosParams): Promise<Producto[]>;
  buscarProductosCrudo(params: BuscarProductosParams): Promise<RamosScraperResponse>;
}
