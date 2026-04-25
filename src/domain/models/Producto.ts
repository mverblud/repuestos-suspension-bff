export interface Producto {
  codigo: string;
  marca: string;
  categoria: string;
  descripcion: string;
  precioVenta: number;
  foto?: string;
  stock?: number;
  fuente: 'ramos' | 'asm';
}

export interface BuscarProductosParams {
  codigoAuto: string;
  marcaId: number;
  rubroId: number;
  cantidadRenglones: number;
}
