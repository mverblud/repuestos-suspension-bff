import type { Producto } from '../../../domain/models/Producto';

export interface RamosProductoRaw {
  codigo: string;
  marca: string;
  rubro: string;
  nombre: string;
  foto?: string;
  descuento: number;
  precioSugerido: number;
}

export function mapRamosProducto(raw: RamosProductoRaw): Producto {
  return {
    codigo: raw.codigo,
    marca: raw.marca,
    categoria: raw.rubro,
    descripcion: raw.nombre,
    precioVenta: raw.precioSugerido,
    foto: raw.foto,
    stock: undefined,
    fuente: 'RAMOS',
  };
}
