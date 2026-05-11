import type { Modelo } from '../../domain/mappings/Modelo';

export interface IModeloRepository {
  obtenerTodos(): Modelo[];
}
