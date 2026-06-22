import type { ILoginUseCase } from '../ports/ILoginUseCase';
import type { ITokenService } from '../ports/ITokenService';
import type { LoginParams, LoginResult } from '../../domain/models/Auth';

interface LoginUseCaseDeps {
  authUsername: string;
  authPassword: string;
  jwtExpiresIn: string;
  tokenService: ITokenService;
}

export class LoginUseCase implements ILoginUseCase {
  private readonly authUsername: string;
  private readonly authPassword: string;
  private readonly jwtExpiresIn: string;
  private readonly tokenService: ITokenService;

  constructor({ authUsername, authPassword, jwtExpiresIn, tokenService }: LoginUseCaseDeps) {
    this.authUsername = authUsername;
    this.authPassword = authPassword;
    this.jwtExpiresIn = jwtExpiresIn;
    this.tokenService = tokenService;
  }

  async execute({ username, password }: LoginParams): Promise<LoginResult> {
    if (username !== this.authUsername || password !== this.authPassword) {
      throw new Error('CREDENCIALES_INVALIDAS');
    }

    const token = this.tokenService.sign({ sub: this.authUsername });
    return { token, expiresIn: this.jwtExpiresIn };
  }
}
