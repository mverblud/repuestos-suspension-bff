import type { FastifyInstance } from 'fastify';
import type { CatalogoController } from '../controllers/CatalogoController';

export async function catalogoRoutes(
  fastify: FastifyInstance,
  controller: CatalogoController,
): Promise<void> {
  fastify.get('/catalogo', controller.obtenerCatalogo.bind(controller));

  fastify.get(
    '/catalogo/:codigo',
    {
      schema: {
        params: {
          type: 'object',
          required: ['codigo'],
          properties: {
            codigo: { type: 'string' },
          },
        },
      },
    },
    controller.obtenerPorCodigo.bind(controller),
  );

  fastify.post(
    '/catalogo',
    {
      schema: {
        body: {
          type: 'object',
          required: ['codigo', 'variantes'],
          properties: {
            codigo: { type: 'string' },
            variantes: { type: 'array' },
          },
        },
      },
    },
    controller.crear.bind(controller),
  );

  fastify.put(
    '/catalogo/:codigo',
    {
      schema: {
        params: {
          type: 'object',
          required: ['codigo'],
          properties: {
            codigo: { type: 'string' },
          },
        },
      },
    },
    controller.actualizar.bind(controller),
  );

  fastify.delete(
    '/catalogo/:codigo',
    {
      schema: {
        params: {
          type: 'object',
          required: ['codigo'],
          properties: {
            codigo: { type: 'string' },
          },
        },
      },
    },
    controller.eliminar.bind(controller),
  );
}
