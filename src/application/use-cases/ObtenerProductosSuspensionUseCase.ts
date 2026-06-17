import type { BuscarProductosParams, Producto, SadarCatalogoPart } from '../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../ports/IObtenerProductosUseCase';
import type { IRamosProductoRepository } from '../ports/IRamosProductoRepository';
import type { IAsmProductoRepository } from '../ports/IAsmProductoRepository';
import type { RubroEquivalencia } from '../../domain/mappings/RubroEquivalencia';
import rubroEquivalenciasJson from '../../domain/mappings/rubroEquivalencias.json';
import catalogoSadarJson from '../../domain/mappings/catalogo.sadar.json';

const equivalencias = rubroEquivalenciasJson as unknown as RubroEquivalencia[];

const catalogoSadar = (catalogoSadarJson as unknown as { parts: SadarCatalogoPart[] }).parts;

function extractCodigoNumerico(codigo: string): string {
  return codigo.replace(/^SDR/, '').replace(/O$/, '');
}

function buscarEnCatalogo(codigoNumerico: string): SadarCatalogoPart[] {
  return catalogoSadar.filter((part) => part.codigo.includes(codigoNumerico));
}

export class ObtenerProductosSuspensionUseCase implements IObtenerProductosUseCase {
  private readonly ramosProductoRepository: IRamosProductoRepository;
  private readonly asmProductoRepository: IAsmProductoRepository;

  constructor({
    ramosProductoRepository,
    asmProductoRepository,
  }: {
    ramosProductoRepository: IRamosProductoRepository;
    asmProductoRepository: IAsmProductoRepository;
  }) {
    this.ramosProductoRepository = ramosProductoRepository;
    this.asmProductoRepository = asmProductoRepository;
  }

  async execute(params: BuscarProductosParams): Promise<Producto[]> {
    const equiv = equivalencias.find((e) => e.rubroId === params.rubroId);
    if (equiv === undefined) {
      throw new Error(`Rubro ${params.rubroId} no tiene equivalencia configurada`);
    }

    const promises: Promise<Producto[]>[] = [];

    if (equiv.rubroEquivalencias.RM !== null) {
      promises.push(
        this.ramosProductoRepository.obtenerProductos({
          ...params,
          rubroId: equiv.rubroEquivalencias.RM.rubroId,
        }),
      );
    }

    if (equiv.rubroEquivalencias.ASM !== null) {
      promises.push(
        this.asmProductoRepository.obtenerProductos({
          codigoAuto: params.codigoAuto,
          categoria: equiv.rubroEquivalencias.ASM.rubroName,
        }),
      );
    }

    const resultados = await Promise.all(promises);
    let productos = resultados.flat();

    if (params.rubroId === 1 && equiv.rubroEquivalencias.RM !== null) {
      productos = productos.map((p) => {
        if (p.fuente === 'RAMOS' && p.marca === 'SADAR') {
          const codigoNumerico = extractCodigoNumerico(p.codigo);
          const catalogo = buscarEnCatalogo(codigoNumerico);
          return { ...p, codigoNumerico, catalogo };
        }
        return p;
      });
    }

    return productos;
  }
}
