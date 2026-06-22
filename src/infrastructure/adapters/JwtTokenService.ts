import jwt from 'jsonwebtoken';
import type { ITokenService } from '../../application/ports/ITokenService';
import type { TokenPayload } from '../../domain/models/Auth';

interface JwtTokenServiceDeps {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export class JwtTokenService implements ITokenService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor({ jwtSecret, jwtExpiresIn }: JwtTokenServiceDeps) {
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.jwtSecret);
    if (typeof decoded === 'string') {
      throw new Error('Token inválido');
    }
    return decoded as TokenPayload;
  }
}
