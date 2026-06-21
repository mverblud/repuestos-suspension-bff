import type { BuscarProductosParams, RamosScraperResponse } from '../../domain/models/Producto';

export interface IObtenerProductosRamosUseCase {
  execute(params: BuscarProductosParams): Promise<RamosScraperResponse>;
}
