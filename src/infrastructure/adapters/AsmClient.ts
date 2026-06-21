import { request } from 'undici';
import type { AsmSearchBody, AsmSearchResponse, ProductoExternoRaw } from '../../domain/models/Producto';
import type { IAuthService } from '../../application/ports/IAuthService';

interface AsmSearchParams {
  query: string;
  categoria: string;
}

interface AsmSearchRawResponse {
  totalProductos: number;
  productos: ProductoExternoRaw[];
  timing?: { totalMs: number };
  error?: string;
}

export class AsmClient {
  private readonly baseUrl: string;
  private readonly authService: IAuthService;

  constructor({ asmBaseUrl, authService }: { asmBaseUrl: string; authService: IAuthService }) {
    this.baseUrl = asmBaseUrl;
    this.authService = authService;
  }

  async search({ query, categoria }: AsmSearchParams): Promise<ProductoExternoRaw[]> {
    const token = await this.authService.getToken();

    const { body } = await request(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, filters: { categoria } }),
    });

    const response = (await body.json()) as AsmSearchRawResponse;
    if (response.error !== undefined) {
      throw new Error(`ASM error: ${response.error}`);
    }
    return response.productos ?? [];
  }

  async searchCrudo(searchBody: AsmSearchBody): Promise<AsmSearchResponse> {
    const token = await this.authService.getToken();

    const { body } = await request(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(searchBody),
    });

    return (await body.json()) as AsmSearchResponse;
  }
}
