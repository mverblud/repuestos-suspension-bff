import type { ProductoOVEnriquecido } from '../../domain/models/ProductoOV';

export interface IObtenerProductosOVUseCase {
  execute(): Promise<ProductoOVEnriquecido[]>;
}
