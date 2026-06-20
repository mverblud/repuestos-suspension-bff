import type { SadarCatalogoPart } from '../../domain/models/Producto';

export interface IActualizarCatalogoPartUseCase {
  execute(
    codigo: string,
    cambios: Partial<Omit<SadarCatalogoPart, 'codigo'>>,
  ): Promise<SadarCatalogoPart | null>;
}
