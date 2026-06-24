import { ObtenerProductosOVUseCase } from '../../../src/application/use-cases/ObtenerProductosOVUseCase';
import type { IOVProductoRepository } from '../../../src/application/ports/IOVProductoRepository';
import type { IRamosProductoRepository } from '../../../src/application/ports/IRamosProductoRepository';
import type { ProductoOVBase } from '../../../src/domain/models/ProductoOV';
import type { RamosScraperResponse } from '../../../src/domain/models/Producto';

const makeRmResponse = (codigos: string[]): RamosScraperResponse => ({
  params: {},
  totalProductos: codigos.length,
  productos: codigos.map((codigo) => ({
    codigo,
    marca: 'SADAR',
    rubro: 'AMORTIGUADOR',
    aplicacion: '',
    precioLista: 100000,
    iva: 21,
    descuento: 55,
    costoNeto: 45000,
    montoIVA: 9450,
    costoIVA: 54450,
    margen: 30,
    precioSugerido: 70785,
  })),
});

const items: ProductoOVBase[] = [
  // codigo exacto en RM: SDR10034
  { codigo: 'SDR10034', ubicacion: 'A2', stock: 2, categoria: 'AMORTIGUADOR', marca: 'SADAR', aplicacion: '' },
  // codigo con sufijo en RM: IR0827LCG  (parte numérica 0827 == 0827)
  { codigo: 'IR0827', ubicacion: 'A1', stock: 2, categoria: 'AMORTIGUADOR', marca: 'IRAUTO', aplicacion: '' },
  // otra marca: no llama a RM
  { codigo: 'GB480434', ubicacion: 'C1', stock: 2, categoria: 'AMORTIGUADOR', marca: 'COFAP', aplicacion: '' },
];

describe('ObtenerProductosOVUseCase', () => {
  let ovProductoRepository: IOVProductoRepository;
  let ramosProductoRepository: IRamosProductoRepository;

  beforeEach(() => {
    ovProductoRepository = { obtenerTodos: jest.fn().mockReturnValue(items) };
    ramosProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest
        .fn()
        .mockImplementation(({ codigoAuto }: { codigoAuto: string }) => {
          if (codigoAuto === 'SDR10034') return Promise.resolve(makeRmResponse(['SDR10034']));
          if (codigoAuto === 'IR0827') return Promise.resolve(makeRmResponse(['IR0827LCG', 'OTRO9999']));
          return Promise.resolve(makeRmResponse([]));
        }),
    };
  });

  it('llama a RM solo para items SADAR e IRAUTO', async () => {
    const useCase = new ObtenerProductosOVUseCase({ ovProductoRepository, ramosProductoRepository });
    await useCase.execute();

    expect(ramosProductoRepository.buscarProductosCrudo).toHaveBeenCalledTimes(2);
    expect(ramosProductoRepository.buscarProductosCrudo).toHaveBeenCalledWith(
      expect.objectContaining({ codigoAuto: 'SDR10034' }),
    );
    expect(ramosProductoRepository.buscarProductosCrudo).toHaveBeenCalledWith(
      expect.objectContaining({ codigoAuto: 'IR0827' }),
    );
  });

  it('hace match por parte numérica y devuelve solo el producto coincidente', async () => {
    const useCase = new ObtenerProductosOVUseCase({ ovProductoRepository, ramosProductoRepository });
    const result = await useCase.execute();

    // SDR10034 → match exacto con SDR10034
    expect(result[0].rmData).toMatchObject({ codigo: 'SDR10034' });
    // IR0827 → match numérico con IR0827LCG (0827 == 0827)
    expect(result[1].rmData).toMatchObject({ codigo: 'IR0827LCG' });
    // COFAP → sin enriquecimiento
    expect(result[2].rmData).toBeUndefined();
  });

  it('deja rmData undefined cuando no hay coincidencia numérica en RM', async () => {
    (ramosProductoRepository.buscarProductosCrudo as jest.Mock).mockResolvedValue(
      makeRmResponse(['OTRO9999']),
    );
    const useCase = new ObtenerProductosOVUseCase({ ovProductoRepository, ramosProductoRepository });
    const result = await useCase.execute();

    expect(result[0].rmData).toBeUndefined();
  });

  it('retorna el item sin rmData si la llamada a RM falla', async () => {
    (ramosProductoRepository.buscarProductosCrudo as jest.Mock).mockRejectedValue(new Error('RM error'));
    const useCase = new ObtenerProductosOVUseCase({ ovProductoRepository, ramosProductoRepository });
    const result = await useCase.execute();

    expect(result[0].rmData).toBeUndefined();
    expect(result[0].codigo).toBe('SDR10034');
  });
});
