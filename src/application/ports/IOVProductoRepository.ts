import type { ProductoOVBase } from '../../domain/models/ProductoOV';

export interface IOVProductoRepository {
  obtenerTodos(): ProductoOVBase[];
}
