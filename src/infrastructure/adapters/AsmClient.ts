import { request } from 'undici';
import type { IAuthService } from '../../application/ports/IAuthService';
import type { AsmProductoRaw } from './mappers/productoAsmMapper';

interface AsmSearchParams {
  query: string;
  categoria: string;
}

interface AsmSearchResponse {
  total: number;
  products: AsmProductoRaw[];
  timing?: unknown;
  error?: string;
}

export class AsmClient {
  private readonly baseUrl: string;
  private readonly authService: IAuthService;

  constructor({ asmBaseUrl, authService }: { asmBaseUrl: string; authService: IAuthService }) {
    this.baseUrl = asmBaseUrl;
    this.authService = authService;
  }

  async search({ query, categoria }: AsmSearchParams): Promise<AsmProductoRaw[]> {
    const token = await this.authService.getToken();

    const { body } = await request(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, filters: { categoria } }),
    });

    const response = (await body.json()) as AsmSearchResponse;
    if (response.error !== undefined) {
      throw new Error(`ASM error: ${response.error}`);
    }
    return response.products ?? [];
  }
}
