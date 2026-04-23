import { ProductoScraperAdapter } from './ProductoScraperAdapter';
import { request } from 'undici';
import type { BuscarProductosParams } from '../../domain/models/Producto';

jest.mock('undici', () => ({
  request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

describe('ProductoScraperAdapter', () => {
  const params: BuscarProductosParams = {
    codigoAuto: 'ABC123',
    marcaId: 1,
    rubroId: 2,
    cantidadRenglones: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should POST to scraper endpoint and return products', async () => {
    const mockProducts = [{ descripcion: 'Amortiguador' }];
    const mockBody = { json: jest.fn().mockResolvedValue(mockProducts) };
    mockRequest.mockResolvedValue({
      body: mockBody,
    } as unknown as Awaited<ReturnType<typeof request>>);

    const adapter = new ProductoScraperAdapter({ scraperBaseUrl: 'http://localhost:3001' });
    const result = await adapter.obtenerProductos(params);

    expect(mockRequest).toHaveBeenCalledWith(
      'http://localhost:3001/scraper/productos',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      },
    );
    expect(result).toEqual(mockProducts);
  });
});
