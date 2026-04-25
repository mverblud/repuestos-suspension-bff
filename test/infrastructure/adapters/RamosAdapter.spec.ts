import { RamosAdapter } from '../../../src/infrastructure/adapters/RamosAdapter';
import { request } from 'undici';
import type { BuscarProductosParams } from '../../../src/domain/models/Producto';
import type { RamosProductoRaw } from '../../../src/infrastructure/adapters/mappers/productoRamosMapper';

jest.mock('undici', () => ({ request: jest.fn() }));

const mockRequest = jest.mocked(request);

describe('RamosAdapter', () => {
  const params: BuscarProductosParams = {
    codigoAuto: 'ABC123',
    marcaId: 1,
    rubroId: 1,
    cantidadRenglones: 10,
  };

  beforeEach(() => jest.clearAllMocks());

  it('should POST to scraper endpoint and return mapped products', async () => {
    const raw: RamosProductoRaw[] = [
      {
        codigo: 'P001',
        marca: 'Monroe',
        rubro: 'AMORTIGUADORES',
        nombre: 'Amortiguador delantero',
        foto: 'http://img.test/p001.jpg',
        descuento: 10,
        precioSugerido: 1500,
      },
    ];
    const mockBody = { json: jest.fn().mockResolvedValue(raw) };
    mockRequest.mockResolvedValue({ body: mockBody } as unknown as Awaited<ReturnType<typeof request>>);

    const adapter = new RamosAdapter({ ramosBaseUrl: 'http://localhost:3001' });
    const result = await adapter.obtenerProductos(params);

    expect(mockRequest).toHaveBeenCalledWith('http://localhost:3001/scraper/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    expect(result).toEqual([
      {
        codigo: 'P001',
        marca: 'Monroe',
        categoria: 'AMORTIGUADORES',
        descripcion: 'Amortiguador delantero',
        precioVenta: 1500,
        foto: 'http://img.test/p001.jpg',
        stock: undefined,
        fuente: 'ramos',
      },
    ]);
  });
});
