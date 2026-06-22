import type { Producto, ProductoExternoRaw } from '../../../domain/models/Producto';

export function mapAsmProducto(raw: ProductoExternoRaw): Producto {
  return { ...raw, proveedor: 'ASM' };
}
