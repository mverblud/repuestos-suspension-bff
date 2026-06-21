import type { AsmSearchBody, AsmSearchResponse, Producto } from '../../domain/models/Producto';

export interface BuscarProductosAsmParams {
  codigoAuto: string;
  categoria: string;
}

export interface IAsmProductoRepository {
  obtenerProductos(params: BuscarProductosAsmParams): Promise<Producto[]>;
  buscarProductosCrudo(body: AsmSearchBody): Promise<AsmSearchResponse>;
}
