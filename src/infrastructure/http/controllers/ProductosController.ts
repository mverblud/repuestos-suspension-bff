import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AsmSearchBody, BuscarProductosParams, Producto } from '../../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../../../application/ports/IObtenerProductosUseCase';
import type { IObtenerProductosRamosUseCase } from '../../../application/ports/IObtenerProductosRamosUseCase';
import type { IObtenerProductosAsmUseCase } from '../../../application/ports/IObtenerProductosAsmUseCase';

interface BuscarProductosResponse {
  totalProductos: number;
  productos: Producto[];
}

export class ProductosController {
  private readonly obtenerProductosUseCase: IObtenerProductosUseCase;
  private readonly obtenerProductosRamosUseCase: IObtenerProductosRamosUseCase;
  private readonly obtenerProductosAsmUseCase: IObtenerProductosAsmUseCase;

  constructor({
    obtenerProductosUseCase,
    obtenerProductosRamosUseCase,
    obtenerProductosAsmUseCase,
  }: {
    obtenerProductosUseCase: IObtenerProductosUseCase;
    obtenerProductosRamosUseCase: IObtenerProductosRamosUseCase;
    obtenerProductosAsmUseCase: IObtenerProductosAsmUseCase;
  }) {
    this.obtenerProductosUseCase = obtenerProductosUseCase;
    this.obtenerProductosRamosUseCase = obtenerProductosRamosUseCase;
    this.obtenerProductosAsmUseCase = obtenerProductosAsmUseCase;
  }

  async buscarProductos(
    request: FastifyRequest<{ Body: BuscarProductosParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const productos: Producto[] = await this.obtenerProductosUseCase.execute(request.body);
    const response: BuscarProductosResponse = { totalProductos: productos.length, productos };
    await reply.send(response);
  }

  async buscarProductosRamos(
    request: FastifyRequest<{ Body: BuscarProductosParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const response = await this.obtenerProductosRamosUseCase.execute(request.body);
    await reply.send(response);
  }

  async buscarProductosAsm(
    request: FastifyRequest<{ Body: AsmSearchBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const response = await this.obtenerProductosAsmUseCase.execute(request.body);
    await reply.send(response);
  }
}
