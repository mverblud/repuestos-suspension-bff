import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../ports/IObtenerProductosUseCase';
import type { IProductoRepository } from '../ports/IProductoRepository';

export class ObtenerProductosSuspensionUseCase implements IObtenerProductosUseCase {
  private readonly productoRepository: IProductoRepository;

  constructor({ productoRepository }: { productoRepository: IProductoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(params: BuscarProductosParams): Promise<Producto[]> {
    return this.productoRepository.obtenerProductos(params);
  }
}
