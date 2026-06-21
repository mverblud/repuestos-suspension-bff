import { ObtenerProductosAsmUseCase } from '../../../src/application/use-cases/ObtenerProductosAsmUseCase';
import type { IAsmProductoRepository } from '../../../src/application/ports/IAsmProductoRepository';
import type { AsmSearchBody, AsmSearchResponse } from '../../../src/domain/models/Producto';

describe('ObtenerProductosAsmUseCase', () => {
  const body: AsmSearchBody = {
    query: 'cronos',
    filters: { categoria: 'AMORTIGUADORES' },
  };

  const scraperResponse: AsmSearchResponse = {
    total: 2,
    products: [
      { code: 'B001', brand: 'Sachs', category: 'AMORTIGUADORES', vehicle: 'Fiat Cronos', precioVenta: 2000 },
      { code: 'B002', brand: 'Monroe', category: 'AMORTIGUADORES', vehicle: 'Fiat Cronos', precioVenta: 1800 },
    ],
    timing: 42,
  };

  it('should delegate to asmProductoRepository.buscarProductosCrudo and return raw response', async () => {
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest.fn().mockResolvedValue(scraperResponse),
    };

    const useCase = new ObtenerProductosAsmUseCase({ asmProductoRepository });

    const result = await useCase.execute(body);

    expect(asmProductoRepository.buscarProductosCrudo).toHaveBeenCalledWith(body);
    expect(asmProductoRepository.obtenerProductos).not.toHaveBeenCalled();
    expect(result).toEqual(scraperResponse);
  });

  it('should pass through ASM error field without throwing', async () => {
    const errorResponse: AsmSearchResponse = { total: 0, products: [], error: 'not found' };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest.fn().mockResolvedValue(errorResponse),
    };

    const useCase = new ObtenerProductosAsmUseCase({ asmProductoRepository });

    const result = await useCase.execute(body);

    expect(result).toEqual(errorResponse);
  });
});
