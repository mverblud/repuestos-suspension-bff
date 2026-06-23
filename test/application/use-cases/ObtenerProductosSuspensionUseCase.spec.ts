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
    codigo: 'MON001',
    marca: 'Monroe',
    rubro: 'AMORTIGUADOR',
    aplicacion: 'Amortiguador delantero',
    precioLista: 90948.34,
    iva: 21,
    descuento: 30,
    costoNeto: 63663.84,
    montoIVA: 13369.41,
    costoIVA: 77033.25,
    margen: 20,
    precioSugerido: 92439.9,
    proveedor: 'RAMOS',
  };

  const productoAsm: Producto = {
    codigo: '34882G-COR',
    marca: 'CORVEN',
    rubro: 'AMORTIGUADOR',
    aplicacion: 'FIAT Cronos 18> Del. Derecho',
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
  };

  it('should call both repositories in parallel and merge results', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue([productoRamos]),
      buscarProductosCrudo: jest.fn(),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue([productoAsm]),
      buscarProductosCrudo: jest.fn(),
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

  it('should return only ASM products when RM fails', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn().mockRejectedValue(new Error('RM timeout')),
      buscarProductosCrudo: jest.fn(),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue([productoAsm]),
      buscarProductosCrudo: jest.fn(),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({
      ramosProductoRepository,
      asmProductoRepository,
    });

    const result = await useCase.execute(params);
    expect(result).toEqual([productoAsm]);
  });

  it('should return only RM products when ASM fails', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue([productoRamos]),
      buscarProductosCrudo: jest.fn(),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn().mockRejectedValue(new Error('ASM timeout')),
      buscarProductosCrudo: jest.fn(),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({
      ramosProductoRepository,
      asmProductoRepository,
    });

    const result = await useCase.execute(params);
    expect(result).toEqual([productoRamos]);
  });

  it('should throw when both RM and ASM fail', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn().mockRejectedValue(new Error('RM timeout')),
      buscarProductosCrudo: jest.fn(),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn().mockRejectedValue(new Error('ASM timeout')),
      buscarProductosCrudo: jest.fn(),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({
      ramosProductoRepository,
      asmProductoRepository,
    });

    await expect(useCase.execute(params)).rejects.toThrow('Todos los servicios fallaron');
  });

  it('should throw when rubroId has no equivalencia', async () => {
    const ramosProductoRepository: IRamosProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest.fn(),
    };
    const asmProductoRepository: IAsmProductoRepository = {
      obtenerProductos: jest.fn(),
      buscarProductosCrudo: jest.fn(),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({
      ramosProductoRepository,
      asmProductoRepository,
    });

    await expect(useCase.execute({ ...params, rubroId: 9999 })).rejects.toThrow('9999');
  });
});
