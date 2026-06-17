export interface SadarDimensional {
  abierto: string;
  cerrado: string;
  superior: string;
  inferior: string;
}

export interface SadarEquivalencia {
  codigo: string;
  marca: string;
}

export interface SadarVehiculo {
  fabricante: string;
  modelo: string;
  tipo: string;
  desde: number | null;
  hasta: number | null;
  quality_flags: Record<string, unknown>;
}

export interface SadarVariante {
  variant_id: string;
  posicion: string;
  estructura: string;
  aplicacion: string;
  dimensional: SadarDimensional;
  equivalencia: SadarEquivalencia[];
  aplicaciones: SadarVehiculo[];
  quality_flags: Record<string, unknown>;
}

export interface SadarCatalogoPart {
  codigo: string;
  variantes: SadarVariante[];
  quality_flags: Record<string, unknown>;
}

export interface Producto {
  codigo: string;
  marca: string;
  categoria: string;
  descripcion: string;
  precioVenta: number;
  foto?: string;
  stock?: number;
  proveedor: 'RAMOS' | 'ASM';
  codigoNumerico?: string;
  catalogo?: SadarCatalogoPart[];
}

export interface BuscarProductosParams {
  codigoAuto: string;
  marcaId: number;
  rubroId: number;
  cantidadRenglones: number;
}
