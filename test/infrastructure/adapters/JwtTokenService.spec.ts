import { JwtTokenService } from '../../../src/infrastructure/adapters/JwtTokenService';
import type { TokenPayload } from '../../../src/domain/models/Auth';

const SECRET = 'test-secret-key';
const EXPIRES_IN = '1h';

function makeService(secret = SECRET, expiresIn = EXPIRES_IN): JwtTokenService {
  return new JwtTokenService({ jwtSecret: secret, jwtExpiresIn: expiresIn });
}

describe('JwtTokenService', () => {
  describe('sign', () => {
    it('should return a JWT string with three segments', () => {
      const service = makeService();
      const token = service.sign({ sub: 'admin' });

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should embed the payload subject in the token', () => {
      const service = makeService();
      const token = service.sign({ sub: 'admin' });
      const segment = token.split('.')[1];
      const decoded = JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as { sub?: string };

      expect(decoded.sub).toBe('admin');
    });
  });

  describe('verify', () => {
    it('should return the original payload when token is valid', () => {
      const service = makeService();
      const payload: TokenPayload = { sub: 'admin' };
      const token = service.sign(payload);

      const result = service.verify(token);

      expect(result.sub).toBe('admin');
    });

    it('should throw when the token is signed with a different secret', () => {
      const signerService = makeService('secret-a');
      const verifierService = makeService('secret-b');
      const token = signerService.sign({ sub: 'admin' });

      expect(() => verifierService.verify(token)).toThrow();
    });

    it('should throw when the token string is malformed', () => {
      const service = makeService();

      expect(() => service.verify('not.a.valid.jwt')).toThrow();
    });

    it('should throw when the token is an empty string', () => {
      const service = makeService();

      expect(() => service.verify('')).toThrow();
    });
  });

  describe('sign → verify round-trip', () => {
    it('should produce a token that verifies back to the same subject', () => {
      const service = makeService();
      const original: TokenPayload = { sub: 'test-user' };
      const token = service.sign(original);

      const recovered = service.verify(token);

      expect(recovered.sub).toBe(original.sub);
    });
  });
});
