import { LoginUseCase } from '../../../src/application/use-cases/LoginUseCase';
import type { ITokenService } from '../../../src/application/ports/ITokenService';
import type { TokenPayload } from '../../../src/domain/models/Auth';

const FIXED_USERNAME = 'admin';
const FIXED_PASSWORD = 's3cr3t';
const FIXED_TOKEN = 'header.payload.signature';
const FIXED_EXPIRES_IN = '8h';

function makeTokenService(): jest.Mocked<ITokenService> {
  return {
    sign: jest.fn().mockReturnValue(FIXED_TOKEN),
    verify: jest.fn().mockReturnValue({ sub: FIXED_USERNAME } satisfies TokenPayload),
  };
}

function makeUseCase(tokenService: ITokenService = makeTokenService()): LoginUseCase {
  return new LoginUseCase({
    authUsername: FIXED_USERNAME,
    authPassword: FIXED_PASSWORD,
    jwtExpiresIn: FIXED_EXPIRES_IN,
    tokenService,
  });
}

describe('LoginUseCase', () => {
  describe('execute', () => {
    it('should return token when credentials are correct', async () => {
      const tokenService = makeTokenService();
      const useCase = makeUseCase(tokenService);

      const result = await useCase.execute({ username: FIXED_USERNAME, password: FIXED_PASSWORD });

      expect(result).toEqual({ token: FIXED_TOKEN, expiresIn: FIXED_EXPIRES_IN });
      expect(tokenService.sign).toHaveBeenCalledWith({ sub: FIXED_USERNAME });
    });

    it('should throw CREDENCIALES_INVALIDAS when password is wrong', async () => {
      const useCase = makeUseCase();

      await expect(
        useCase.execute({ username: FIXED_USERNAME, password: 'wrong-password' }),
      ).rejects.toThrow('CREDENCIALES_INVALIDAS');
    });

    it('should throw CREDENCIALES_INVALIDAS when username is wrong', async () => {
      const useCase = makeUseCase();

      await expect(
        useCase.execute({ username: 'other-user', password: FIXED_PASSWORD }),
      ).rejects.toThrow('CREDENCIALES_INVALIDAS');
    });

    it('should throw CREDENCIALES_INVALIDAS when both credentials are wrong', async () => {
      const useCase = makeUseCase();

      await expect(
        useCase.execute({ username: 'other-user', password: 'wrong-password' }),
      ).rejects.toThrow('CREDENCIALES_INVALIDAS');
    });

    it('should not call tokenService.sign when credentials are invalid', async () => {
      const tokenService = makeTokenService();
      const useCase = makeUseCase(tokenService);

      await expect(
        useCase.execute({ username: FIXED_USERNAME, password: 'wrong' }),
      ).rejects.toThrow();

      expect(tokenService.sign).not.toHaveBeenCalled();
    });
  });
});
