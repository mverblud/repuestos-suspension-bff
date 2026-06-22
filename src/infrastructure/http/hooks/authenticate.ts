import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ITokenService } from '../../../application/ports/ITokenService';

type OnRequestHook = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

export function createAuthenticateHook(
  tokenService: ITokenService,
  publicPaths: string[],
): OnRequestHook {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Dejar pasar preflight CORS
    if (request.method === 'OPTIONS') return;

    // Dejar pasar rutas públicas (ignorar querystring)
    const path = request.url.split('?')[0];
    if (publicPaths.includes(path)) return;

    const authHeader = request.headers.authorization;
    if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
      await reply.code(401).send({ error: 'No autorizado' });
      return;
    }

    const token = authHeader.slice(7);
    try {
      tokenService.verify(token);
    } catch {
      await reply.code(401).send({ error: 'No autorizado' });
    }
  };
}
