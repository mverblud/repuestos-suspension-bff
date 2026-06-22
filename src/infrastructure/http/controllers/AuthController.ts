import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ILoginUseCase } from '../../../application/ports/ILoginUseCase';
import type { LoginParams } from '../../../domain/models/Auth';

export class AuthController {
  private readonly loginUseCase: ILoginUseCase;

  constructor({ loginUseCase }: { loginUseCase: ILoginUseCase }) {
    this.loginUseCase = loginUseCase;
  }

  async login(
    request: FastifyRequest<{ Body: LoginParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const result = await this.loginUseCase.execute(request.body);
      await reply.send(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'CREDENCIALES_INVALIDAS') {
        await reply.code(401).send({ error: 'Credenciales inválidas' });
        return;
      }
      throw err;
    }
  }
}
