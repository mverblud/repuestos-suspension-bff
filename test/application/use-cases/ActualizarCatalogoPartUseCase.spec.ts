import { ActualizarCatalogoPartUseCase } from '../../../src/application/use-cases/ActualizarCatalogoPartUseCase';
import type { ICatalogoRepository } from '../../../src/application/ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../../src/domain/models/Producto';

const partActualizada: SadarCatalogoPart = {
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

describe('ActualizarCatalogoPartUseCase', () => {
  const useCase = new ActualizarCatalogoPartUseCase({ catalogoRepository });

  beforeEach(() => jest.clearAllMocks());

  it('devuelve la part actualizada cuando existe el codigo', async () => {
    jest.mocked(catalogoRepository.actualizar).mockResolvedValue(partActualizada);

    const cambios = { variantes: [] };
    const result = await useCase.execute('ABC001', cambios);

    expect(result).toEqual(partActualizada);
    expect(catalogoRepository.actualizar).toHaveBeenCalledWith('ABC001', cambios);
  });

  it('devuelve null cuando no existe el codigo', async () => {
    jest.mocked(catalogoRepository.actualizar).mockResolvedValue(null);

    const result = await useCase.execute('NOEXISTE', {});

    expect(result).toBeNull();
  });
});
