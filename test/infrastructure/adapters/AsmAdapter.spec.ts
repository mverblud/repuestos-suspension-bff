import { AsmAdapter } from '../../../src/infrastructure/adapters/AsmAdapter';
import { AsmClient } from '../../../src/infrastructure/adapters/AsmClient';
import { request } from 'undici';
import type { IAuthService } from '../../../src/application/ports/IAuthService';
import type { BuscarProductosAsmParams } from '../../../src/application/ports/IAsmProductoRepository';
import type { ProductoExternoRaw } from '../../../src/domain/models/Producto';

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
    const rawProducts: ProductoExternoRaw[] = [
      {
        codigo: '34882G-COR',
        marca: 'CORVEN',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'FIAT Cronos 18> Del. Derecho',
        imagen: '',
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
    ];
    const mockBody = {
      json: jest.fn().mockResolvedValue({ totalProductos: 1, productos: rawProducts, timing: { totalMs: 120 } }),
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
        codigo: '34882G-COR',
        marca: 'CORVEN',
        rubro: 'AMORTIGUADOR',
        aplicacion: 'FIAT Cronos 18> Del. Derecho',
        imagen: '',
        precioLista: 178977,
        iva: 21,
        descuento: 50,
        costoNeto: 89488.5,
        montoIVA: 18792.58,
        costoIVA: 108281.08,
        margen: 26,
        precioSugerido: 136434.17,
        stock: 2,
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
