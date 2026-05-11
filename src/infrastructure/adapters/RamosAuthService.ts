import { request } from 'undici';
import type { IAuthService } from '../../application/ports/IAuthService';

interface RamosAuthServiceDeps {
  ramosBaseUrl: string;
  rmUsername: string;
  rmPassword: string;
}

export class RamosAuthService implements IAuthService {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private cachedToken: string | null = null;

  constructor({ ramosBaseUrl, rmUsername, rmPassword }: RamosAuthServiceDeps) {
    this.baseUrl = ramosBaseUrl;
    this.username = rmUsername;
    this.password = rmPassword;
  }

  async getToken(): Promise<string> {
    if (this.cachedToken !== null && !this.isExpiringSoon(this.cachedToken)) {
      return this.cachedToken;
    }
    this.cachedToken = await this.fetchToken();
    return this.cachedToken;
  }

  private async fetchToken(): Promise<string> {
    const { body } = await request(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username, password: this.password }),
    });
    const { token } = (await body.json()) as { token: string };
    return token;
  }

  private isExpiringSoon(token: string): boolean {
    try {
      const segment = token.split('.')[1];
      if (segment === undefined) return true;
      const payload = JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as { exp?: number };
      if (payload.exp === undefined) return false;
      return payload.exp * 1000 - Date.now() < 30_000;
    } catch {
      return true;
    }
  }
}
