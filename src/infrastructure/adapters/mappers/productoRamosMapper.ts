import type { Producto, ProductoExternoRaw } from '../../../domain/models/Producto';

export function mapRamosProducto(raw: ProductoExternoRaw): Producto {
  return { ...raw, stock: undefined, proveedor: 'RAMOS' };
}
