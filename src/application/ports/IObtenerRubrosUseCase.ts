import type { ObtenerRubrosParams, ObtenerRubrosResult } from '../../domain/models/Rubro';

export interface IObtenerRubrosUseCase {
  execute(params: ObtenerRubrosParams): ObtenerRubrosResult;
}
