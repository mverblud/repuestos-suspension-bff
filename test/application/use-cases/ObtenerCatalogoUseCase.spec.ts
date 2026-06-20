import { ObtenerCatalogoUseCase } from '../../../src/application/use-cases/ObtenerCatalogoUseCase';
import type { ICatalogoRepository } from '../../../src/application/ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../../src/domain/models/Producto';

const partA: SadarCatalogoPart = {
  codigo: 'ABC001',
  variantes: [],
};
const partB: SadarCatalogoPart = {
  codigo: 'ABC002',
  variantes: [],
};

const catalogoRepository: ICatalogoRepository = {
  obtenerTodos: jest.fn().mockResolvedValue([partA, partB]),
  obtenerPorCodigo: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

describe('ObtenerCatalogoUseCase', () => {
  const useCase = new ObtenerCatalogoUseCase({ catalogoRepository });

  beforeEach(() => jest.clearAllMocks());

  it('devuelve el total y la lista de parts', async () => {
    const result = await useCase.execute();

    expect(result.total).toBe(2);
    expect(result.parts).toEqual([partA, partB]);
  });

  it('llama a obtenerTodos del repositorio', async () => {
    await useCase.execute();

    expect(catalogoRepository.obtenerTodos).toHaveBeenCalledTimes(1);
  });
});
