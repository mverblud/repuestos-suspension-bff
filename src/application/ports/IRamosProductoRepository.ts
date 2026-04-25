import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';

export interface IRamosProductoRepository {
  obtenerProductos(params: BuscarProductosParams): Promise<Producto[]>;
}
