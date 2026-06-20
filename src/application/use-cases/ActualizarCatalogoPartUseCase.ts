import type { IActualizarCatalogoPartUseCase } from '../ports/IActualizarCatalogoPartUseCase';
import type { ICatalogoRepository } from '../ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../domain/models/Producto';

export class ActualizarCatalogoPartUseCase implements IActualizarCatalogoPartUseCase {
  private readonly catalogoRepository: ICatalogoRepository;

  constructor({ catalogoRepository }: { catalogoRepository: ICatalogoRepository }) {
    this.catalogoRepository = catalogoRepository;
  }

  async execute(
    codigo: string,
    cambios: Partial<Omit<SadarCatalogoPart, 'codigo'>>,
  ): Promise<SadarCatalogoPart | null> {
    return this.catalogoRepository.actualizar(codigo, cambios);
  }
}
