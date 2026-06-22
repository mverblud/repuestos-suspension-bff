import { ObtenerProductosAsmUseCase } from '../../../src/application/use-cases/ObtenerProductosAsmUseCase';
import type { IAsmProductoRepository } from '../../../src/application/ports/IAsmProductoRepository';
import type { AsmSearchBody, AsmSearchResponse } from '../../../src/domain/models/Producto';

describe('ObtenerProductosAsmUseCase', () => {
  const body: AsmSearchBody = {
    query: 'cronos',
    filters: { categoria: 'AMORTIGUADORES' },
  };

  const scraperResponse: AsmSearchResponse = {
    totalProductos: 2,
    productos: [
      {
        codigo: '34882G-COR',
        marca: 'CORVEN',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'FIAT Cronos 18> Del. Derecho',
        precioLista: 178977,
        iva: 21,
        descuento: 50,
        costoNeto: 89488.5,
        montoIVA: 18792.58,
        costoIVA: 108281.08,
        margen: 26,
        precioSugerido: 136434.17,
        stock: 2,
      },
      {
        codigo: '34883G-COR',
        marca: 'CORVEN',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'FIAT Cronos 18> Del. Izquierdo',
        precioLista: 178977,
        iva: 21,
        descuento: 50,
        costoNeto: 89488.5,
        montoIVA: 18792.58,
        costoIVA: 108281.08,
        margen: 26,
        precioSugerido: 136434.17,
        stock: 2,
      },
    ],
    timing: { totalMs: 4288 },
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
    const errorResponse: AsmSearchResponse = { totalProductos: 0, productos: [], error: 'not found' };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest.fn().mockResolvedValue(errorResponse),
    };

    const useCase = new ObtenerProductosAsmUseCase({ asmProductoRepository });

    const result = await useCase.execute(body);

    expect(result).toEqual(errorResponse);
  });
});
