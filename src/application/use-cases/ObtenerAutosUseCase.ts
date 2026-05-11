import type {
  ModeloResponse,
  ObtenerAutosParams,
  ObtenerAutosResult,
} from '../../domain/models/Auto';
import type { IMarcaRepository } from '../ports/IMarcaRepository';
import type { IModeloRepository } from '../ports/IModeloRepository';
import type { IObtenerAutosUseCase } from '../ports/IObtenerAutosUseCase';

export class ObtenerAutosUseCase implements IObtenerAutosUseCase {
  private readonly marcaRepository: IMarcaRepository;
  private readonly modeloRepository: IModeloRepository;

  constructor({
    marcaRepository,
    modeloRepository,
  }: {
    marcaRepository: IMarcaRepository;
    modeloRepository: IModeloRepository;
  }) {
    this.marcaRepository = marcaRepository;
    this.modeloRepository = modeloRepository;
  }

  execute({ soloHabilitados }: ObtenerAutosParams): ObtenerAutosResult {
    const marcas = this.marcaRepository.obtenerTodas();
    const modelos = this.modeloRepository.obtenerTodos();

    const modelosPorMarca = new Map<string, ModeloResponse[]>();
    for (const m of modelos) {
      if (soloHabilitados && !m.habilitado) continue;
      const lista = modelosPorMarca.get(m.marcaId) ?? [];
      lista.push({ id: m.id, name: m.nombre, enabled: m.habilitado });
      modelosPorMarca.set(m.marcaId, lista);
    }

    const marcasFiltradas = soloHabilitados ? marcas.filter((m) => m.habilitado) : marcas;

    const brands = marcasFiltradas.map((m) => ({
      id: m.id,
      name: m.nombre,
      enabled: m.habilitado,
      models: modelosPorMarca.get(m.id) ?? [],
    }));

    return { total: brands.length, brands };
  }
}
