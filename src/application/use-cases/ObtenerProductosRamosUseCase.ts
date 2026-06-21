import type { BuscarProductosParams, RamosScraperResponse } from '../../domain/models/Producto';
import type { IObtenerProductosRamosUseCase } from '../ports/IObtenerProductosRamosUseCase';
import type { IRamosProductoRepository } from '../ports/IRamosProductoRepository';

export class ObtenerProductosRamosUseCase implements IObtenerProductosRamosUseCase {
  private readonly ramosProductoRepository: IRamosProductoRepository;

  constructor({ ramosProductoRepository }: { ramosProductoRepository: IRamosProductoRepository }) {
    this.ramosProductoRepository = ramosProductoRepository;
  }

  execute(params: BuscarProductosParams): Promise<RamosScraperResponse> {
    return this.ramosProductoRepository.buscarProductosCrudo(params);
  }
}
