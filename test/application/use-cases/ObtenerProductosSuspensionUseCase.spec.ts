import { ObtenerProductosSuspensionUseCase } from '../../../src/application/use-cases/ObtenerProductosSuspensionUseCase';
import type { IRamosProductoRepository } from '../../../src/application/ports/IRamosProductoRepository';
import type { IAsmProductoRepository } from '../../../src/application/ports/IAsmProductoRepository';
import type { BuscarProductosParams, Producto } from '../../../src/domain/models/Producto';

describe('ObtenerProductosSuspensionUseCase', () => {
  // rubroId: 1 está mapeado en rubroEquivalencias.json
  const params: BuscarProductosParams = {
    codigoAuto: 'ABC123',
    marcaId: 1,
    rubroId: 1,
    cantidadRenglones: 10,
  };

  const productoRamos: Producto = {
    codigo: 'A1',
    marca: 'Monroe',
    categoria: 'AMORTIGUADORES',
    descripcion: 'Amortiguador delantero',
    precioVenta: 1000,
    fuente: 'ramos',
  };

  const productoAsm: Producto = {
    codigo: 'B1',
    marca: 'Sachs',
    categoria: 'AMORTIGUADORES',
    descripcion: 'Amortiguador trasero',
    precioVenta: 1200,
    fuente: 'asm',
  };

  it('should call both repositories in parallel and merge results', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue([productoRamos]),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue([productoAsm]),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({
      ramosProductoRepository,
      asmProductoRepository,
    });

    const result = await useCase.execute(params);

    // rubroId=1 → rm=10 (Amortiguadores), asm=3 → rubroName "AMORTIGUADORES"
    expect(ramosProductoRepository.obtenerProductos).toHaveBeenCalledWith({ ...params, rubroId: 10 });
    expect(asmProductoRepository.obtenerProductos).toHaveBeenCalledWith({
      codigoAuto: params.codigoAuto,
      categoria: 'AMORTIGUADORES',
    });
    expect(result).toEqual([productoRamos, productoAsm]);
  });

  it('should throw when rubroId has no equivalencia', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn(),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn(),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({
      ramosProductoRepository,
      asmProductoRepository,
    });

    await expect(useCase.execute({ ...params, rubroId: 9999 })).rejects.toThrow('9999');
  });
});
