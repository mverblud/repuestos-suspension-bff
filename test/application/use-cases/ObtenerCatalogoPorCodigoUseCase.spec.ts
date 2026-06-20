import { ObtenerCatalogoPorCodigoUseCase } from '../../../src/application/use-cases/ObtenerCatalogoPorCodigoUseCase';
import type { ICatalogoRepository } from '../../../src/application/ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../../src/domain/models/Producto';

const part: SadarCatalogoPart = {
  codigo: 'ABC001',
  variantes: [],
};

const catalogoRepository: ICatalogoRepository = {
  obtenerTodos: jest.fn(),
  obtenerPorCodigo: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

describe('ObtenerCatalogoPorCodigoUseCase', () => {
  const useCase = new ObtenerCatalogoPorCodigoUseCase({ catalogoRepository });

  beforeEach(() => jest.clearAllMocks());

  it('devuelve la part cuando existe el codigo', async () => {
    jest.mocked(catalogoRepository.obtenerPorCodigo).mockResolvedValue(part);

    const result = await useCase.execute('ABC001');

    expect(result).toEqual(part);
    expect(catalogoRepository.obtenerPorCodigo).toHaveBeenCalledWith('ABC001');
  });

  it('devuelve null cuando no existe el codigo', async () => {
    jest.mocked(catalogoRepository.obtenerPorCodigo).mockResolvedValue(null);

    const result = await useCase.execute('NOEXISTE');

    expect(result).toBeNull();
  });
});
