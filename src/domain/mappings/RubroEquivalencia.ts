export interface RubroEquivalencia {
  rubroId: number;
  nombre: string;
  servicioA: { rubroId: string; rubroName: string };
  servicioB: { categoria: string };
}
