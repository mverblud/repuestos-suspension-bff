import type { Producto } from '../../domain/models/Producto';

export interface BuscarProductosAsmParams {
  codigoAuto: string;
  categoria: string;
}

export interface IAsmProductoRepository {
  obtenerProductos(params: BuscarProductosAsmParams): Promise<Producto[]>;
}
