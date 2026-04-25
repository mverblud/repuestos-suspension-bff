import type { BuscarProductosParams, Producto } from '../../domain/models/Producto';
import type { IObtenerProductosUseCase } from '../ports/IObtenerProductosUseCase';
import type { IRamosProductoRepository } from '../ports/IRamosProductoRepository';
import type { IAsmProductoRepository } from '../ports/IAsmProductoRepository';
import type { RubroEquivalencia } from '../../domain/mappings/RubroEquivalencia';
import rubroEquivalenciasJson from '../../domain/mappings/rubroEquivalencias.json';

const equivalencias = rubroEquivalenciasJson as RubroEquivalencia[];

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

    const [productosRamos, productosAsm] = await Promise.all([
      this.ramosProductoRepository.obtenerProductos({
        ...params,
        rubroId: Number(equiv.servicioA.rubroId),
      }),
      this.asmProductoRepository.obtenerProductos({
        codigoAuto: params.codigoAuto,
        categoria: equiv.servicioB.categoria,
      }),
    ]);

    return [...productosRamos, ...productosAsm];
  }
}
