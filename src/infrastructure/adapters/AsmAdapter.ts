import type { AsmSearchBody, AsmSearchResponse, Producto } from '../../domain/models/Producto';
import type { IAsmProductoRepository, BuscarProductosAsmParams } from '../../application/ports/IAsmProductoRepository';
import type { AsmClient } from './AsmClient';
import { mapAsmProducto } from './mappers/productoAsmMapper';

export class AsmAdapter implements IAsmProductoRepository {
  private readonly asmClient: AsmClient;

  constructor({ asmClient }: { asmClient: AsmClient }) {
    this.asmClient = asmClient;
  }

  async obtenerProductos({ codigoAuto, categoria }: BuscarProductosAsmParams): Promise<Producto[]> {
    const raw = await this.asmClient.search({ query: codigoAuto, categoria });
    return raw.map(mapAsmProducto);
  }

  buscarProductosCrudo(body: AsmSearchBody): Promise<AsmSearchResponse> {
    return this.asmClient.searchCrudo(body);
  }
}
