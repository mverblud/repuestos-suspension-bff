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

export interface ProductoExternoRaw {
  codigo: string;
  marca: string;
  rubro: string;
  aplicacion: string;
  imagen?: string;
  precioLista: number;
  iva: number;
  descuento: number;
  costoNeto: number;
  montoIVA: number;
  costoIVA: number;
  margen: number;
  precioSugerido: number;
  stock?: number; // presente en ASM, ausente en RM
}

export interface Producto {
  codigo: string;
  marca: string;
  rubro: string;
  aplicacion: string;
  imagen?: string;
  precioLista: number;
  iva: number;
  descuento: number;
  costoNeto: number;
  montoIVA: number;
  costoIVA: number;
  margen: number;
  precioSugerido: number;
  stock?: number;
  proveedor: 'RAMOS' | 'ASM';
  codigoNumerico?: string;
  catalogo?: SadarCatalogoPart[];
}

export interface BuscarProductosParams {
  codigoAuto: string;
  marcaId: number | string;
  rubroId: number | string;
  cantidadRenglones: number;
}

export interface RamosScraperResponse {
  params: unknown;
  totalProductos: number;
  productos: ProductoExternoRaw[];
}

export interface AsmSearchBody {
  query: string;
  filters: { categoria: string };
}

export interface AsmSearchResponse {
  totalProductos: number;
  productos: ProductoExternoRaw[];
  timing?: { totalMs: number };
  error?: string;
}
