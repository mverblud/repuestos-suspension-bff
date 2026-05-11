import type { FastifyInstance } from 'fastify';
import type { AutosController } from '../controllers/AutosController';

export async function autosRoutes(
  fastify: FastifyInstance,
  controller: AutosController,
): Promise<void> {
  fastify.get(
    '/cars',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            onlyEnabled: { type: 'boolean' },
          },
        },
      },
    },
    controller.obtenerAutos.bind(controller),
  );
}
