import type { SadarCatalogoPart } from '../../domain/models/Producto';

export interface ICrearCatalogoPartUseCase {
  execute(part: SadarCatalogoPart): Promise<SadarCatalogoPart>;
}
