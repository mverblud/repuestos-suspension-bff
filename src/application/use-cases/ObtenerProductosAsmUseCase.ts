import type { AsmSearchBody, AsmSearchResponse } from '../../domain/models/Producto';
import type { IObtenerProductosAsmUseCase } from '../ports/IObtenerProductosAsmUseCase';
import type { IAsmProductoRepository } from '../ports/IAsmProductoRepository';

export class ObtenerProductosAsmUseCase implements IObtenerProductosAsmUseCase {
  private readonly asmProductoRepository: IAsmProductoRepository;

  constructor({ asmProductoRepository }: { asmProductoRepository: IAsmProductoRepository }) {
    this.asmProductoRepository = asmProductoRepository;
  }

  execute(body: AsmSearchBody): Promise<AsmSearchResponse> {
    return this.asmProductoRepository.buscarProductosCrudo(body);
  }
}
