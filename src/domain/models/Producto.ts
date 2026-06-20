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
}

export interface SadarVariante {
  variant_id: string;
  posicion: string;
  estructura: string;
  aplicacion: string;
  dimensional: SadarDimensional;
  equivalencia: SadarEquivalencia[];
  aplicaciones: SadarVehiculo[];
}

export interface SadarCatalogoPart {
  codigo: string;
  variantes: SadarVariante[];
}

export interface Producto {
  codigo: string;
  marca: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen?: string;
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
