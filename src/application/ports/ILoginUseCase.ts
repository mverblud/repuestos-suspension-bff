import type { LoginParams, LoginResult } from '../../domain/models/Auth';

export interface ILoginUseCase {
  execute(params: LoginParams): Promise<LoginResult>;
}
