export interface ObtenerRubrosParams {
  soloHabilitados?: boolean;
}

export interface ProveedorEquivalenciaResponse {
  rubroId: number;
  rubroName: string;
}

export interface RubroConEquivalencias {
  rubroId: number;
  rubroNombre: string;
  rubroHabilitado: boolean;
  equivalencias: {
    RM: ProveedorEquivalenciaResponse | null;
    ASM: ProveedorEquivalenciaResponse | null;
  };
}

export interface ObtenerRubrosResult {
  total: number;
  rubros: RubroConEquivalencias[];
}
