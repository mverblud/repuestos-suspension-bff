import type { TokenPayload } from '../../domain/models/Auth';

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
