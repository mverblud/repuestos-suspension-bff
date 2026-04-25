import { AsmAdapter } from '../../../src/infrastructure/adapters/AsmAdapter';
import { request } from 'undici';
import type { IAuthService } from '../../../src/application/ports/IAuthService';
import type { BuscarProductosParams } from '../../../src/domain/models/Producto';
import type { RubroEquivalencia } from '../../../src/domain/mappings/RubroEquivalencia';
import type { AsmProductoRaw } from '../../../src/infrastructure/adapters/mappers/productoAsmMapper';

jest.mock('undici', () => ({ request: jest.fn() }));

const mockRequest = jest.mocked(request);

const rubroEquivalencias: RubroEquivalencia[] = [
  {
    rubroId: 1,
    nombre: 'Amortiguadores',
    servicioA: { rubroId: '1', rubroName: 'amortiguador' },
    servicioB: { categoria: 'AMORTIGUADORES' },
  },
];

describe('AsmAdapter', () => {
  const params: BuscarProductosParams = {
    codigoAuto: 'ABC123',
    marcaId: 1,
    rubroId: 1,
    cantidadRenglones: 10,
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

    const adapter = new AsmAdapter({
      asmBaseUrl: 'http://localhost:3002',
      authService,
      rubroEquivalencias,
    });

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
        precioVenta: 2000,
        foto: 'http://img.test/b001.jpg',
        stock: 5,
        fuente: 'asm',
      },
    ]);
  });

  it('should throw when rubroId has no equivalencia', async () => {
    const adapter = new AsmAdapter({
      asmBaseUrl: 'http://localhost:3002',
      authService,
      rubroEquivalencias,
    });

    await expect(adapter.obtenerProductos({ ...params, rubroId: 9999 })).rejects.toThrow('9999');
  });
});
