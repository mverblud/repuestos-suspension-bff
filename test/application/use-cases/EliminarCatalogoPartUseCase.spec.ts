import { EliminarCatalogoPartUseCase } from '../../../src/application/use-cases/EliminarCatalogoPartUseCase';
import type { ICatalogoRepository } from '../../../src/application/ports/ICatalogoRepository';

const catalogoRepository: ICatalogoRepository = {
  obtenerTodos: jest.fn(),
  obtenerPorCodigo: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

describe('EliminarCatalogoPartUseCase', () => {
  const useCase = new EliminarCatalogoPartUseCase({ catalogoRepository });

  beforeEach(() => jest.clearAllMocks());

  it('devuelve true cuando el codigo existe y se elimina', async () => {
    jest.mocked(catalogoRepository.eliminar).mockResolvedValue(true);

    const result = await useCase.execute('ABC001');

    expect(result).toBe(true);
    expect(catalogoRepository.eliminar).toHaveBeenCalledWith('ABC001');
  });

  it('devuelve false cuando el codigo no existe', async () => {
    jest.mocked(catalogoRepository.eliminar).mockResolvedValue(false);

    const result = await useCase.execute('NOEXISTE');

    expect(result).toBe(false);
  });
});
