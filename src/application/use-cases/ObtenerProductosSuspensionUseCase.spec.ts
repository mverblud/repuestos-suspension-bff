import { ObtenerProductosSuspensionUseCase } from './ObtenerProductosSuspensionUseCase';
import type { IProductoRepository } from '../ports/IProductoRepository';
import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';

describe('ObtenerProductosSuspensionUseCase', () => {
  const params: BuscarProductosParams = {
    codigoAuto: 'ABC123',
    marcaId: 1,
    rubroId: 2,
    cantidadRenglones: 10,
  };

  const productos: Producto[] = [{ descripcion: 'Amortiguador delantero' }];

  it('should delegate to productoRepository and return results', async () => {
    const productoRepository: IProductoRepository = {
      obtenerProductos: jest.fn().mockResolvedValue(productos),
    };

    const useCase = new ObtenerProductosSuspensionUseCase({ productoRepository });
    const result = await useCase.execute(params);

    expect(productoRepository.obtenerProductos).toHaveBeenCalledWith(params);
    expect(result).toBe(productos);
  });
});
