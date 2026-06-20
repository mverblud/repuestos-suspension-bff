import { CrearCatalogoPartUseCase } from '../../../src/application/use-cases/CrearCatalogoPartUseCase';
import type { ICatalogoRepository } from '../../../src/application/ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../../src/domain/models/Producto';

const nuevaPart: SadarCatalogoPart = {
  codigo: 'NUEVO01',
  variantes: [],
};

const catalogoRepository: ICatalogoRepository = {
  obtenerTodos: jest.fn(),
  obtenerPorCodigo: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

describe('CrearCatalogoPartUseCase', () => {
  const useCase = new CrearCatalogoPartUseCase({ catalogoRepository });

  beforeEach(() => jest.clearAllMocks());

  it('crea la part cuando el codigo no existe', async () => {
    jest.mocked(catalogoRepository.obtenerPorCodigo).mockResolvedValue(null);
    jest.mocked(catalogoRepository.crear).mockResolvedValue(nuevaPart);

    const result = await useCase.execute(nuevaPart);

    expect(result).toEqual(nuevaPart);
    expect(catalogoRepository.crear).toHaveBeenCalledWith(nuevaPart);
  });

  it('lanza CODIGO_DUPLICADO cuando el codigo ya existe', async () => {
    jest.mocked(catalogoRepository.obtenerPorCodigo).mockResolvedValue(nuevaPart);

    await expect(useCase.execute(nuevaPart)).rejects.toThrow('CODIGO_DUPLICADO');
    expect(catalogoRepository.crear).not.toHaveBeenCalled();
  });
});
