import { RamosAuthService } from '../../../src/infrastructure/adapters/RamosAuthService';
import { request } from 'undici';

jest.mock('undici', () => ({ request: jest.fn() }));

const mockRequest = jest.mocked(request);

function makeJwt(expOffsetSeconds: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expOffsetSeconds;
  const payload = Buffer.from(JSON.stringify({ sub: 'user', exp })).toString('base64url');
  return `${header}.${payload}.fakesig`;
}

function makeBody(token: string) {
  return { json: jest.fn().mockResolvedValue({ token }) };
}

describe('RamosAuthService', () => {
  const deps = {
    ramosBaseUrl: 'http://localhost:3001',
    rmUsername: 'admin',
    rmPassword: 'lapassw0rd',
  };

  beforeEach(() => jest.clearAllMocks());

  it('should fetch and cache a token', async () => {
    const token = makeJwt(3600);
    mockRequest.mockResolvedValue({ body: makeBody(token) } as unknown as Awaited<ReturnType<typeof request>>);

    const service = new RamosAuthService(deps);
    const first = await service.getToken();
    const second = await service.getToken();

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(first).toBe(token);
    expect(second).toBe(token);
  });

  it('should re-authenticate when token is within 30s of expiry', async () => {
    const expiredToken = makeJwt(20);
    const freshToken = makeJwt(3600);

    mockRequest
      .mockResolvedValueOnce({ body: makeBody(expiredToken) } as unknown as Awaited<ReturnType<typeof request>>)
      .mockResolvedValueOnce({ body: makeBody(freshToken) } as unknown as Awaited<ReturnType<typeof request>>);

    const service = new RamosAuthService(deps);
    const first = await service.getToken();
    const second = await service.getToken();

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(first).toBe(expiredToken);
    expect(second).toBe(freshToken);
  });

  it('should re-authenticate when cache is empty', async () => {
    const token = makeJwt(3600);
    mockRequest.mockResolvedValue({ body: makeBody(token) } as unknown as Awaited<ReturnType<typeof request>>);

    const service = new RamosAuthService(deps);
    await service.getToken();

    expect(mockRequest).toHaveBeenCalledTimes(1);
  });
});
