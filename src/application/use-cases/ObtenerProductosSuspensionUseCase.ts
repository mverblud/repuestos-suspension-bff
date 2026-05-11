import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../ports/IObtenerProductosUseCase';
import type { IRamosProductoRepository } from '../ports/IRamosProductoRepository';
import type { IAsmProductoRepository } from '../ports/IAsmProductoRepository';
import type { RubroEquivalencia } from '../../domain/mappings/RubroEquivalencia';
import rubroEquivalenciasJson from '../../domain/mappings/rubroEquivalencias.json';

const equivalencias = rubroEquivalenciasJson as unknown as RubroEquivalencia[];

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
    return resultados.flat();
  }
}
