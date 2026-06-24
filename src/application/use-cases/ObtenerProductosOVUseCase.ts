import type { IObtenerProductosOVUseCase } from '../ports/IObtenerProductosOVUseCase';
import type { IOVProductoRepository } from '../ports/IOVProductoRepository';
import type { IRamosProductoRepository } from '../ports/IRamosProductoRepository';
import type { ProductoOVEnriquecido } from '../../domain/models/ProductoOV';

const MARCAS_RM = new Set(['SADAR', 'IRAUTO']);

function extractNumerico(codigo: string): string {
  return codigo.match(/\d+/)?.[0] ?? '';
}

export class ObtenerProductosOVUseCase implements IObtenerProductosOVUseCase {
  private readonly ovProductoRepository: IOVProductoRepository;
  private readonly ramosProductoRepository: IRamosProductoRepository;

  constructor({
    ovProductoRepository,
    ramosProductoRepository,
  }: {
    ovProductoRepository: IOVProductoRepository;
    ramosProductoRepository: IRamosProductoRepository;
  }) {
    this.ovProductoRepository = ovProductoRepository;
    this.ramosProductoRepository = ramosProductoRepository;
  }

  async execute(): Promise<ProductoOVEnriquecido[]> {
    const items = this.ovProductoRepository.obtenerTodos();

    const results = await Promise.allSettled(
      items.map(async (item): Promise<ProductoOVEnriquecido> => {
        if (!MARCAS_RM.has(item.marca)) {
          return item;
        }
        const response = await this.ramosProductoRepository.buscarProductosCrudo({
          codigoAuto: item.codigo,
          marcaId: '',
          rubroId: '',
          cantidadRenglones: 500,
        });
        const numerico = extractNumerico(item.codigo);
        const rmData = response.productos.find(
          (p) => extractNumerico(p.codigo) === numerico,
        );
        return { ...item, rmData };
      }),
    );

    return results.map((result, i) =>
      result.status === 'fulfilled' ? result.value : items[i],
    );
  }
}
