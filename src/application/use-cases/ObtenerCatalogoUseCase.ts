import type { IObtenerCatalogoUseCase } from '../ports/IObtenerCatalogoUseCase';
import type { ICatalogoRepository } from '../ports/ICatalogoRepository';
import type { ObtenerCatalogoResult } from '../../domain/models/Catalogo';

export class ObtenerCatalogoUseCase implements IObtenerCatalogoUseCase {
  private readonly catalogoRepository: ICatalogoRepository;

  constructor({ catalogoRepository }: { catalogoRepository: ICatalogoRepository }) {
    this.catalogoRepository = catalogoRepository;
  }

  async execute(): Promise<ObtenerCatalogoResult> {
    const parts = await this.catalogoRepository.obtenerTodos();
    return { total: parts.length, parts };
  }
}
