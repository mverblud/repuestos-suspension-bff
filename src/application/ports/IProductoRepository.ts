import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';

export interface IProductoRepository {
  obtenerProductos(params: BuscarProductosParams): Promise<Producto[]>;
}
