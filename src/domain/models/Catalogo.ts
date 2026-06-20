import type { SadarCatalogoPart } from './Producto';

export type { SadarCatalogoPart };
export type CrearCatalogoPartParams = SadarCatalogoPart;
export type ActualizarCatalogoPartParams = Partial<Omit<SadarCatalogoPart, 'codigo'>>;

export interface ObtenerCatalogoResult {
  total: number;
  parts: SadarCatalogoPart[];
}
