import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';

export interface IObtenerProductosUseCase {
  execute(params: BuscarProductosParams): Promise<Producto[]>;
}
