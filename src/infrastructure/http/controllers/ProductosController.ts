import type { FastifyReply, FastifyRequest } from 'fastify';
import type { BuscarProductosParams, Producto } from '../../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../../../application/ports/IObtenerProductosUseCase';

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
    await reply.send(productos);
  }
}
