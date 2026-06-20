import type { SadarCatalogoPart } from '../../domain/models/Producto';

export interface ICatalogoRepository {
  obtenerTodos(): Promise<SadarCatalogoPart[]>;
  obtenerPorCodigo(codigo: string): Promise<SadarCatalogoPart | null>;
  crear(part: SadarCatalogoPart): Promise<SadarCatalogoPart>;
  actualizar(
    codigo: string,
    cambios: Partial<Omit<SadarCatalogoPart, 'codigo'>>,
  ): Promise<SadarCatalogoPart | null>;
  eliminar(codigo: string): Promise<boolean>;
}
