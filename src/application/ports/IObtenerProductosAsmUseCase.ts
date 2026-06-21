import type { AsmSearchBody, AsmSearchResponse } from '../../domain/models/Producto';

export interface IObtenerProductosAsmUseCase {
  execute(body: AsmSearchBody): Promise<AsmSearchResponse>;
}
