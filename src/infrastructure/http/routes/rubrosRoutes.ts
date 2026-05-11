import type { FastifyInstance } from 'fastify';
import type { RubrosController } from '../controllers/RubrosController';

export async function rubrosRoutes(
  fastify: FastifyInstance,
  controller: RubrosController,
): Promise<void> {
  fastify.get(
    '/rubros',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            soloHabilitados: { type: 'boolean' },
          },
        },
      },
    },
    controller.obtenerRubros.bind(controller),
  );
}
