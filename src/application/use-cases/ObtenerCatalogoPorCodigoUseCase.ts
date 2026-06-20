import type { IObtenerCatalogoPorCodigoUseCase } from '../ports/IObtenerCatalogoPorCodigoUseCase';
import type { ICatalogoRepository } from '../ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../domain/models/Producto';

export class ObtenerCatalogoPorCodigoUseCase implements IObtenerCatalogoPorCodigoUseCase {
  private readonly catalogoRepository: ICatalogoRepository;

  constructor({ catalogoRepository }: { catalogoRepository: ICatalogoRepository }) {
    this.catalogoRepository = catalogoRepository;
  }

  async execute(codigo: string): Promise<SadarCatalogoPart | null> {
    return this.catalogoRepository.obtenerPorCodigo(codigo);
  }
}
