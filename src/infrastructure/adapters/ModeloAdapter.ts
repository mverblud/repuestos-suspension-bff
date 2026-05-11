import type { IModeloRepository } from '../../application/ports/IModeloRepository';
import type { Modelo } from '../../domain/mappings/Modelo';
import modelsJson from '../../domain/mappings/models.json';

interface ModelJson {
  id: string;
  brandId: string;
  name: string;
  enabled: boolean;
}

export class ModeloAdapter implements IModeloRepository {
  obtenerTodos(): Modelo[] {
    return (modelsJson as ModelJson[]).map((m) => ({
      id: m.id,
      marcaId: m.brandId,
      nombre: m.name.toUpperCase(),
      habilitado: m.enabled,
    }));
  }
}
