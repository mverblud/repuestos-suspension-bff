import type { FastifyReply, FastifyRequest } from 'fastify';
import type { BuscarProductosParams, Producto } from '../../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../../../application/ports/IObtenerProductosUseCase';

interface BuscarProductosResponse {
  totalProductos: number;
  productos: Producto[];
}

export class ProductosController {
  private readonly obtenerProductosUseCase: IObtenerProductosUseCase;

  constructor({ obtenerProductosUseCase }: { obtenerProductosUseCase: IObtenerProductosUseCase }) {
    this.obtenerProductosUseCase = obtenerProductosUseCase;
  }

  async buscarProductos(
    request: FastifyRequest<{ Body: BuscarProductosParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const productos: Producto[] = await this.obtenerProductosUseCase.execute(request.body);
    const response: BuscarProductosResponse = { totalProductos: productos.length, productos };
    await reply.send(response);
  }
}
