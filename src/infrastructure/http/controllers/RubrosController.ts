import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IObtenerRubrosUseCase } from '../../../application/ports/IObtenerRubrosUseCase';

interface RubrosQuery {
  soloHabilitados?: boolean;
}

export class RubrosController {
  private readonly obtenerRubrosUseCase: IObtenerRubrosUseCase;

  constructor({ obtenerRubrosUseCase }: { obtenerRubrosUseCase: IObtenerRubrosUseCase }) {
    this.obtenerRubrosUseCase = obtenerRubrosUseCase;
  }

  async obtenerRubros(
    request: FastifyRequest<{ Querystring: RubrosQuery }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { soloHabilitados } = request.query;
    const result = this.obtenerRubrosUseCase.execute({ soloHabilitados });
    await reply.send(result);
  }
}
