import type { Marca } from '../../domain/mappings/Marca';

export interface IMarcaRepository {
  obtenerTodas(): Marca[];
}
