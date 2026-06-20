import type { IEliminarCatalogoPartUseCase } from '../ports/IEliminarCatalogoPartUseCase';
import type { ICatalogoRepository } from '../ports/ICatalogoRepository';

export class EliminarCatalogoPartUseCase implements IEliminarCatalogoPartUseCase {
  private readonly catalogoRepository: ICatalogoRepository;

  constructor({ catalogoRepository }: { catalogoRepository: ICatalogoRepository }) {
    this.catalogoRepository = catalogoRepository;
  }

  async execute(codigo: string): Promise<boolean> {
    return this.catalogoRepository.eliminar(codigo);
  }
}
