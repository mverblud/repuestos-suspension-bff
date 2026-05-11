import type { RubroEquivalencia } from '../../domain/mappings/RubroEquivalencia';

export interface IRubroEquivalenciaRepository {
  obtenerTodos(): RubroEquivalencia[];
}
