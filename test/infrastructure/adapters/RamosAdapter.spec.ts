import { RamosAdapter } from '../../../src/infrastructure/adapters/RamosAdapter';
import { RamosClient } from '../../../src/infrastructure/adapters/RamosClient';
import { request } from 'undici';
import type { IAuthService } from '../../../src/application/ports/IAuthService';
import type { BuscarProductosParams, ProductoExternoRaw } from '../../../src/domain/models/Producto';

jest.mock('undici', () => ({ request: jest.fn() }));

const mockRequest = jest.mocked(request);

describe('RamosAdapter', () => {
  const params: BuscarProductosParams = {
    codigoAuto: 'ABC123',
    marcaId: 1,
    rubroId: 1,
    cantidadRenglones: 10,
  };

  const ramosAuthService: IAuthService = {
    getToken: jest.fn().mockResolvedValue('mock-token'),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should POST to scraper endpoint with auth header and return mapped products', async () => {
    const raw: ProductoExternoRaw[] = [
      {
        codigo: 'SDR10552O',
        marca: 'SADAR',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'AMO FIAT CRONOS 1.3/ 1.8 TRAS',
        imagen: 'https://gesis2.com/autopartesramos/res/img/articulos/SDR10552O.jpg',
        precioLista: 90948.34,
        iva: 21,
        descuento: 55,
        costoNeto: 40926.75,
        montoIVA: 8594.62,
        costoIVA: 49521.37,
        margen: 30,
        precioSugerido: 64377.78,
      },
    ];
    const mockBody = { json: jest.fn().mockResolvedValue({ params: {}, totalProductos: 1, productos: raw }) };
    mockRequest.mockResolvedValue({ body: mockBody } as unknown as Awaited<ReturnType<typeof request>>);

    const ramosClient = new RamosClient({ ramosBaseUrl: 'http://localhost:3001', ramosAuthService });
    const adapter = new RamosAdapter({ ramosClient });
    const result = await adapter.obtenerProductos(params);

    expect(ramosAuthService.getToken).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith('http://localhost:3001/scraper/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      },
      body: JSON.stringify(params),
    });

    expect(result).toEqual([
      {
        codigo: 'SDR10552O',
        marca: 'SADAR',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'AMO FIAT CRONOS 1.3/ 1.8 TRAS',
        imagen: 'https://gesis2.com/autopartesramos/res/img/articulos/SDR10552O.jpg',
        precioLista: 90948.34,
        iva: 21,
        descuento: 55,
        costoNeto: 40926.75,
        montoIVA: 8594.62,
        costoIVA: 49521.37,
        margen: 30,
        precioSugerido: 64377.78,
        stock: undefined,
        proveedor: 'RAMOS',
      },
    ]);
  });
});
