import type { ObtenerCatalogoResult } from '../../domain/models/Catalogo';

export interface IObtenerCatalogoUseCase {
  execute(): Promise<ObtenerCatalogoResult>;
}
