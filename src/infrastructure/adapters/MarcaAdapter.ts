import type { IMarcaRepository } from '../../application/ports/IMarcaRepository';
import type { Marca } from '../../domain/mappings/Marca';
import brandsJson from '../../domain/mappings/brands.json';

interface BrandJson {
  id: string;
  name: string;
  enabled: boolean;
}

export class MarcaAdapter implements IMarcaRepository {
  obtenerTodas(): Marca[] {
    return (brandsJson as BrandJson[]).map((b) => ({
      id: b.id,
      nombre: b.name.toUpperCase(),
      habilitado: b.enabled,
    }));
  }
}
