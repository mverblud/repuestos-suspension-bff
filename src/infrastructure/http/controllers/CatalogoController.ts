import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IObtenerCatalogoUseCase } from '../../../application/ports/IObtenerCatalogoUseCase';
import type { IObtenerCatalogoPorCodigoUseCase } from '../../../application/ports/IObtenerCatalogoPorCodigoUseCase';
import type { ICrearCatalogoPartUseCase } from '../../../application/ports/ICrearCatalogoPartUseCase';
import type { IActualizarCatalogoPartUseCase } from '../../../application/ports/IActualizarCatalogoPartUseCase';
import type { IEliminarCatalogoPartUseCase } from '../../../application/ports/IEliminarCatalogoPartUseCase';
import type { SadarCatalogoPart } from '../../../domain/models/Producto';

interface CodigoParams {
  codigo: string;
}

export class CatalogoController {
  private readonly obtenerCatalogoUseCase: IObtenerCatalogoUseCase;
  private readonly obtenerCatalogoPorCodigoUseCase: IObtenerCatalogoPorCodigoUseCase;
  private readonly crearCatalogoPartUseCase: ICrearCatalogoPartUseCase;
  private readonly actualizarCatalogoPartUseCase: IActualizarCatalogoPartUseCase;
  private readonly eliminarCatalogoPartUseCase: IEliminarCatalogoPartUseCase;

  constructor({
    obtenerCatalogoUseCase,
    obtenerCatalogoPorCodigoUseCase,
    crearCatalogoPartUseCase,
    actualizarCatalogoPartUseCase,
    eliminarCatalogoPartUseCase,
  }: {
    obtenerCatalogoUseCase: IObtenerCatalogoUseCase;
    obtenerCatalogoPorCodigoUseCase: IObtenerCatalogoPorCodigoUseCase;
    crearCatalogoPartUseCase: ICrearCatalogoPartUseCase;
    actualizarCatalogoPartUseCase: IActualizarCatalogoPartUseCase;
    eliminarCatalogoPartUseCase: IEliminarCatalogoPartUseCase;
  }) {
    this.obtenerCatalogoUseCase = obtenerCatalogoUseCase;
    this.obtenerCatalogoPorCodigoUseCase = obtenerCatalogoPorCodigoUseCase;
    this.crearCatalogoPartUseCase = crearCatalogoPartUseCase;
    this.actualizarCatalogoPartUseCase = actualizarCatalogoPartUseCase;
    this.eliminarCatalogoPartUseCase = eliminarCatalogoPartUseCase;
  }

  async obtenerCatalogo(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await this.obtenerCatalogoUseCase.execute();
    await reply.send(result);
  }

  async obtenerPorCodigo(
    request: FastifyRequest<{ Params: CodigoParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { codigo } = request.params;
    const part = await this.obtenerCatalogoPorCodigoUseCase.execute(codigo);
    if (part === null) {
      await reply.code(404).send({ error: 'Part no encontrada', codigo });
      return;
    }
    await reply.send(part);
  }

  async crear(
    request: FastifyRequest<{ Body: SadarCatalogoPart }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const part = await this.crearCatalogoPartUseCase.execute(request.body);
      await reply.code(201).send(part);
    } catch (err) {
      if (err instanceof Error && err.message === 'CODIGO_DUPLICADO') {
        await reply.code(409).send({ error: 'Ya existe una part con ese codigo', codigo: request.body.codigo });
        return;
      }
      throw err;
    }
  }

  async actualizar(
    request: FastifyRequest<{ Params: CodigoParams; Body: Partial<Omit<SadarCatalogoPart, 'codigo'>> }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { codigo } = request.params;
    const part = await this.actualizarCatalogoPartUseCase.execute(codigo, request.body);
    if (part === null) {
      await reply.code(404).send({ error: 'Part no encontrada', codigo });
      return;
    }
    await reply.send(part);
  }

  async eliminar(
    request: FastifyRequest<{ Params: CodigoParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { codigo } = request.params;
    const eliminado = await this.eliminarCatalogoPartUseCase.execute(codigo);
    if (!eliminado) {
      await reply.code(404).send({ error: 'Part no encontrada', codigo });
      return;
    }
    await reply.code(204).send();
  }
}
