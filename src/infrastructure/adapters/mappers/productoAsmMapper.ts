import type { Producto } from '../../../domain/models/Producto';

export interface AsmProductoRaw {
  code: string;
  brand: string;
  category: string;
  vehicle: string;
  precioVenta: number;
  stock?: number;
  image?: string;
}

export function mapAsmProducto(raw: AsmProductoRaw): Producto {
  return {
    codigo: raw.code,
    marca: raw.brand,
    categoria: raw.category,
    descripcion: raw.vehicle,
    precio: raw.precioVenta,
    imagen: raw.image,
    stock: raw.stock,
    proveedor: 'ASM',
  };
}
