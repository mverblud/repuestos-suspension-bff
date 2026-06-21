import { ObtenerProductosRamosUseCase } from '../../../src/application/use-cases/ObtenerProductosRamosUseCase';
import type { IRamosProductoRepository } from '../../../src/application/ports/IRamosProductoRepository';
import type { BuscarProductosParams, RamosScraperResponse } from '../../../src/domain/models/Producto';

describe('ObtenerProductosRamosUseCase', () => {
  const params: BuscarProductosParams = {
    codigoAuto: 'corsa',
    marcaId: '46',
    rubroId: '10',
    cantidadRenglones: 500,
  };

  const scraperResponse: RamosScraperResponse = {
    params: { codigoAuto: 'corsa', marcaId: '46', rubroId: '10', cantidadRenglones: 500 },
    totalProductos: 2,
    productos: [
      { codigo: 'A1', nombre: 'Amortiguador delantero', precioSugerido: 1000 },
      { codigo: 'A2', nombre: 'Amortiguador trasero', precioSugerido: 1200 },
    ],
  };

  it('should delegate to ramosProductoRepository.buscarProductosCrudo and return raw response', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest.fn().mockResolvedValue(scraperResponse),
    };

    const useCase = new ObtenerProductosRamosUseCase({ ramosProductoRepository });

    const result = await useCase.execute(params);

    expect(ramosProductoRepository.buscarProductosCrudo).toHaveBeenCalledWith(params);
    expect(ramosProductoRepository.obtenerProductos).not.toHaveBeenCalled();
    expect(result).toEqual(scraperResponse);
  });
});
