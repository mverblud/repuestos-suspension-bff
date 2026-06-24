import type { IOVProductoRepository } from '../../application/ports/IOVProductoRepository';
import type { ProductoOVBase } from '../../domain/models/ProductoOV';
import productosOV from '../../domain/mappings/productos.OV.json';

export class OVProductoAdapter implements IOVProductoRepository {
  obtenerTodos(): ProductoOVBase[] {
    return productosOV as ProductoOVBase[];
  }
}
