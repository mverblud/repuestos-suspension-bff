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
      {
        codigo: 'SDR10552O',
        marca: 'SADAR',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'AMO FIAT CRONOS 1.3/ 1.8 TRAS',
        precioLista: 90948.34,
        iva: 21,
        descuento: 55,
        costoNeto: 40926.75,
        montoIVA: 8594.62,
        costoIVA: 49521.37,
        margen: 30,
        precioSugerido: 64377.78,
      },
      {
        codigo: 'SDR60339O',
        marca: 'SADAR',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'AMO FIAT CRONOS DEL DER 1.3/ 1.8',
        precioLista: 151227.84,
        iva: 21,
        descuento: 55,
        costoNeto: 68052.53,
        montoIVA: 14291.03,
        costoIVA: 82343.56,
        margen: 30,
        precioSugerido: 107046.63,
      },
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
