import { AsmAdapter } from '../../../src/infrastructure/adapters/AsmAdapter';
import { AsmClient } from '../../../src/infrastructure/adapters/AsmClient';
import { request } from 'undici';
import type { IAuthService } from '../../../src/application/ports/IAuthService';
import type { BuscarProductosAsmParams } from '../../../src/application/ports/IAsmProductoRepository';
import type { AsmProductoRaw } from '../../../src/infrastructure/adapters/mappers/productoAsmMapper';

jest.mock('undici', () => ({ request: jest.fn() }));

const mockRequest = jest.mocked(request);

describe('AsmAdapter', () => {
  const params: BuscarProductosAsmParams = {
    codigoAuto: 'ABC123',
    categoria: 'AMORTIGUADORES',
  };

  const authService: IAuthService = {
    getToken: jest.fn().mockResolvedValue('mock-token'),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should make authenticated search and return mapped products', async () => {
    const rawProducts: AsmProductoRaw[] = [
      {
        code: 'B001',
        brand: 'Sachs',
        category: 'AMORTIGUADORES',
        vehicle: 'Amortiguador trasero',
        precioVenta: 2000,
        stock: 5,
        image: 'http://img.test/b001.jpg',
      },
    ];
    const mockBody = {
      json: jest.fn().mockResolvedValue({ total: 1, products: rawProducts, timing: 50 }),
    };
    mockRequest.mockResolvedValue({ body: mockBody } as unknown as Awaited<ReturnType<typeof request>>);

    const asmClient = new AsmClient({ asmBaseUrl: 'http://localhost:3002', authService });
    const adapter = new AsmAdapter({ asmClient });

    const result = await adapter.obtenerProductos(params);

    expect(authService.getToken).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith('http://localhost:3002/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      },
      body: JSON.stringify({ query: 'ABC123', filters: { categoria: 'AMORTIGUADORES' } }),
    });

    expect(result).toEqual([
      {
        codigo: 'B001',
        marca: 'Sachs',
        categoria: 'AMORTIGUADORES',
        descripcion: 'Amortiguador trasero',
        precio: 2000,
        imagen: 'http://img.test/b001.jpg',
        stock: 5,
        proveedor: 'ASM',
      },
    ]);
  });

  it('should propagate ASM errors', async () => {
    const mockBody = {
      json: jest.fn().mockResolvedValue({ error: 'not found' }),
    };
    mockRequest.mockResolvedValue({ body: mockBody } as unknown as Awaited<ReturnType<typeof request>>);

    const asmClient = new AsmClient({ asmBaseUrl: 'http://localhost:3002', authService });
    const adapter = new AsmAdapter({ asmClient });

    await expect(adapter.obtenerProductos(params)).rejects.toThrow('ASM error: not found');
  });
});
