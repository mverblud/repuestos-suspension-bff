export interface Producto {
  descripcion: string;
  codigo?: string;
  precio?: number;
  marca?: string;
  disponible?: boolean;
}

export interface BuscarProductosParams {
  codigoAuto: string;
  marcaId: number;
  rubroId: number;
  cantidadRenglones: number;
}
