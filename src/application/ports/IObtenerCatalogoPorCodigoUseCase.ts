import type { SadarCatalogoPart } from '../../domain/models/Producto';

export interface IObtenerCatalogoPorCodigoUseCase {
  execute(codigo: string): Promise<SadarCatalogoPart | null>;
}
