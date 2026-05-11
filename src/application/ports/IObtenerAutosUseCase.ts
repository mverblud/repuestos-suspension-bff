import type { ObtenerAutosParams, ObtenerAutosResult } from '../../domain/models/Auto';

export interface IObtenerAutosUseCase {
  execute(params: ObtenerAutosParams): ObtenerAutosResult;
}
