import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IObtenerAutosUseCase } from '../../../application/ports/IObtenerAutosUseCase';

interface AutosQuery {
  onlyEnabled?: boolean;
}

export class AutosController {
  private readonly obtenerAutosUseCase: IObtenerAutosUseCase;

  constructor({ obtenerAutosUseCase }: { obtenerAutosUseCase: IObtenerAutosUseCase }) {
    this.obtenerAutosUseCase = obtenerAutosUseCase;
  }

  async obtenerAutos(
    request: FastifyRequest<{ Querystring: AutosQuery }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { onlyEnabled } = request.query;
    const result = this.obtenerAutosUseCase.execute({ soloHabilitados: onlyEnabled });
    await reply.send(result);
  }
}
