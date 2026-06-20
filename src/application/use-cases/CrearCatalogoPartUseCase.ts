import type { ICrearCatalogoPartUseCase } from '../ports/ICrearCatalogoPartUseCase';
import type { ICatalogoRepository } from '../ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../domain/models/Producto';

export class CrearCatalogoPartUseCase implements ICrearCatalogoPartUseCase {
  private readonly catalogoRepository: ICatalogoRepository;

  constructor({ catalogoRepository }: { catalogoRepository: ICatalogoRepository }) {
    this.catalogoRepository = catalogoRepository;
  }

  async execute(part: SadarCatalogoPart): Promise<SadarCatalogoPart> {
    const existente = await this.catalogoRepository.obtenerPorCodigo(part.codigo);
    if (existente !== null) {
      throw new Error('CODIGO_DUPLICADO');
    }
    return this.catalogoRepository.crear(part);
  }
}
