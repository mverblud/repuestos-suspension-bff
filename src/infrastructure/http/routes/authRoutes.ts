import type { FastifyInstance } from 'fastify';
import type { AuthController } from '../controllers/AuthController';

export async function authRoutes(
  fastify: FastifyInstance,
  controller: AuthController,
): Promise<void> {
  fastify.post(
    '/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      },
    },
    controller.login.bind(controller),
  );
}
