import type { IRubroEquivalenciaRepository } from '../../application/ports/IRubroEquivalenciaRepository';
import type { RubroEquivalencia } from '../../domain/mappings/RubroEquivalencia';
import rubroEquivalenciasJson from '../../domain/mappings/rubroEquivalencias.json';

export class RubroEquivalenciaAdapter implements IRubroEquivalenciaRepository {
  obtenerTodos(): RubroEquivalencia[] {
    return rubroEquivalenciasJson as unknown as RubroEquivalencia[];
  }
}
