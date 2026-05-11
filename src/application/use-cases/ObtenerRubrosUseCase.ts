import type { ObtenerRubrosParams, ObtenerRubrosResult } from '../../domain/models/Rubro';
import type { IObtenerRubrosUseCase } from '../ports/IObtenerRubrosUseCase';
import type { IRubroEquivalenciaRepository } from '../ports/IRubroEquivalenciaRepository';

export class ObtenerRubrosUseCase implements IObtenerRubrosUseCase {
  private readonly rubroEquivalenciaRepository: IRubroEquivalenciaRepository;

  constructor({
    rubroEquivalenciaRepository,
  }: {
    rubroEquivalenciaRepository: IRubroEquivalenciaRepository;
  }) {
    this.rubroEquivalenciaRepository = rubroEquivalenciaRepository;
  }

  execute({ soloHabilitados }: ObtenerRubrosParams): ObtenerRubrosResult {
    const todos = this.rubroEquivalenciaRepository.obtenerTodos();
    const filtrados = soloHabilitados ? todos.filter((r) => r.rubroHabilitado) : todos;

    const rubros = filtrados.map((r) => ({
      rubroId: r.rubroId,
      rubroNombre: r.rubroName,
      rubroHabilitado: r.rubroHabilitado,
      equivalencias: r.rubroEquivalencias,
    }));

    return { total: rubros.length, rubros };
  }
}
