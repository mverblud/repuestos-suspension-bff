import type { ProductoExternoRaw } from './Producto';

export interface ProductoOVBase {
  codigo: string;
  ubicacion: string;
  stock: number;
  categoria: string;
  marca: string;
  aplicacion: string;
}

export interface ProductoOVEnriquecido extends ProductoOVBase {
  rmData?: ProductoExternoRaw;
}
