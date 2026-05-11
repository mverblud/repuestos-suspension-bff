export interface ProveedorRubroEquivalencia {
  rubroId: number;
  rubroName: string;
}

export interface RubroEquivalencia {
  rubroId: number;
  rubroName: string;
  rubroHabilitado: boolean;
  rubroEquivalencias: {
    RM: ProveedorRubroEquivalencia | null;
    ASM: ProveedorRubroEquivalencia | null;
  };
}
